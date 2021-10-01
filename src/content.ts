import { cyan, cyanBright, yellow, yellowBright } from "chalk";
import { readFileSync } from "fs";
import { isBinaryFileSync } from "isbinaryfile";
import { lookup } from "mime-types";
import { cwd } from "process";
import { table } from "table";
import { Walk } from "./walk";

interface Count {
  // The mime type of the file
  mimeType: string;
  // The number of files present in the current directory
  // with the specific mime-type
  files: number;
  // The lines of code present in all the files
  // with the specific mime-type(in the current directory)
  lines: number;
}
export class ContentPercent {
  private readonly path;
  private files: number = 0;
  private lines: number = 0;

  /**
   * @constructor
   * @param {Array<string>} parameters The command line parameters
   * @param {string} path The path to check for files
   */
  constructor(parameters: Array<string>, path: string = cwd()) {
    this.path = path;
    const files: Array<string> = new Walk(this.path, parameters).files;
    const mime = this.mimeTypes(files);

    console.clear();

    const stats: Map<string, Count> = this.createStats(mime);
    const percent: Map<string, Count> = this.createPercent(stats);

    this.displayTable(percent);
  }

  /**
   * @private
   *
   * Display the data onto the screen in the form
   * of a table
   *
   * @param data The calculated data to display to the screen
   */
  private displayTable = (data: Map<string, Count>): void => {
    let tableData: Array<Array<string>> = [
      [cyanBright("Type"), yellowBright("Files"), yellowBright("Lines")],
    ];
    for (const key of Array.from(data.keys())) {
      const element: Count | undefined = data.get(key);
      if (!element) {
        continue;
      }
      tableData.push([
        cyan(element.mimeType),
        yellow(`${element.files}%`),
        yellow(`${element.lines}%`),
      ]);
    }
    console.log(table(tableData));
  };

  /**
   * @private
   *
   * Convert the data in numbers to percent
   *
   * @param {Map<string, Count>} stats The current stats based on numbers
   * @returns {Map<string, Count>} The new stats based on percent
   */
  private createPercent = (stats: Map<string, Count>): Map<string, Count> => {
    let percent: Map<string, Count> = stats;
    let keys: Array<string> = Array.from(percent.keys());
    for (let index = 0; index < keys.length; index++) {
      const element: Count | undefined = percent.get(keys[index]);
      if (!element) {
        continue;
      }
      percent.set(keys[index], {
        mimeType: element.mimeType,
        files: parseFloat(((element.files / this.files) * 100).toFixed(1)),
        lines: parseFloat(((element.lines / this.lines) * 100).toFixed(1)),
      });
    }
    return percent;
  };

  /**
   * @private
   *
   * Get the mime-type of each file
   * @param {Array<string>} files The array of file in the current directory(sub directories included)
   * @returns {Map<string, Array<string>>}
   */
  private mimeTypes = (files: Array<string>): Map<string, Array<string>> => {
    let typeMap: Map<string, Array<string>> = new Map<string, Array<string>>();
    for (let index = 0; index < files.length; index++) {
      const file: string = files[index];
      const type: string | false = lookup(file);

      if (isBinaryFileSync(file)) {
        continue;
      }

      const typeString: string =
        type == false ? "unknown" : type.split("/").slice(1)[0];
      let match: Array<string> | undefined = typeMap.get(typeString);
      if (!match) {
        match = [];
        typeMap.set(typeString, match);
      }
      match.push(file);
      typeMap.set(typeString, match);
    }
    return typeMap;
  };

  private createStats = (
    types: Map<string, Array<string>>
  ): Map<string, Count> => {
    const keys: Array<string> = Array.from(types.keys());
    let data: Map<string, Count> = new Map<string, Count>();
    for (let index = 0; index < keys.length; index++) {
      let linesOfCode: number = 0;
      const element: Array<string> | undefined = types.get(keys[index]);
      if (!element) {
        continue;
      }
      for (let fileIndex = 0; fileIndex < element.length; fileIndex++) {
        const currentFile: string = element[fileIndex];
        this.files += 1;
        linesOfCode += readFileSync(currentFile).toString().split("\n").length;
      }
      const count: Count = {
        mimeType: keys[index],
        files: element.length,
        lines: linesOfCode,
      };
      data.set(keys[index], count);
      this.lines += linesOfCode;
    }

    return data;
  };
}
