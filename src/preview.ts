import boxen from "boxen";
import { greenBright, redBright, rgb } from "chalk";
import { readFileSync, Stats, statSync } from "fs";
import { basename } from "path";
import sizeOf from 'image-size'
import { ISizeCalculationResult } from "image-size/dist/types/interface";

/**
 * Show preview for normal files(files which are not images)
 * and directories
 */
const showFilePreview = (
  filename: string,
  stats: Stats,
  fields?: Map<string, Function>
): void => {
  const collectFieldValues = (): Array<string> => {
    if (!fields) return [];
    let data: Array<string> = [];
    let keys: Array<string> = Array.from(fields.keys());
    for (let index = 0; index < keys.length; index++) {
      const name: string = keys[index];
      const value: Function = fields.get(name);
      const results:any = value(filename)
      if(!results) continue;
      data.push(`${name}: ${results}`);
    }
    return data;
  };
  const base: string = basename(filename);
  let displayString: Array<string> = [
    `Name: ${base}`,
    `Type: Directory`,
    `Created at: ${stats.birthtime.toDateString()}`,
  ];
  const extraFieldValues: Array<string> = collectFieldValues();
  if (extraFieldValues.length > 0) {
    displayString = displayString.concat(extraFieldValues);
  }
  console.log(greenBright(boxen(displayString.join("\n"), { padding: 1 })));
};

const isImage = (filename: string): boolean => {
  const extensions: Array<string> = [".png", ".jpg", ".jpeg"];
  const results: Array<boolean> = extensions.map((value: string): boolean => {
    return filename.endsWith(value);
  });
  return results.includes(true);
};

/**
 * Shows a file prview
 * @param {string} filename The name of the file
 * @returns
 */
export const previewFiles = async (filename: string): Promise<void> => {
  const stats: Stats = statSync(filename);
  if (stats.isDirectory()) {
    showFilePreview(filename, stats);
    return;
  } else {
    let extraFields:Map<string, Function> = new Map<string, Function>([
      [
        "Extension",
        (filename: string): string => {
          return filename.split(".").slice(-1)[0];
        },
      ],
      [
        "Size",
        (filename: string): string => {
          return `${stats.size} bytes`;
        },
      ],
      ['Image size', (filename:string):string | undefined => {
        if(!isImage(filename)) return undefined;
        const size:ISizeCalculationResult = sizeOf(filename)
        return `${size.width}x${size.height}`
      }]
    ])

    showFilePreview(filename, stats, extraFields)
  }
};
