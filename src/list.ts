import { readdirSync, readFile, Stats, statSync } from "fs";
import { dirname, join } from "path";
import { checkFileExists, clearPreviousLine, File } from "./utils";
import { chdir, cwd } from "process";
import { CommandLineException } from "./exception";
import { highlight } from "cli-highlight";
import {
  cyan,
  magenta,
  yellow,
  green,
  yellowBright,
  cyanBright,
  magentaBright,
  greenBright,
} from "chalk";
import { table } from "table";
import { InputMode } from "./input";
import { KeyboardEvents } from "./listeners";
import { Bookmarks } from "./bookmarks";
import { Properties } from "./properties";

export class ListFiles {
  private path: File;
  private files?: Array<string>;
  private parameters: Array<string>;
  private showTitle: boolean;

  private currentFileIndex: number = 0;
  private bookmarks: Bookmarks = new Bookmarks();
  private logIndex: number = 0;

  constructor(
    path: File,
    parameters: Array<string>,
    showTitle: boolean = true
  ) {
    this.path = path;
    this.parameters = parameters;
    this.showTitle = showTitle;
    this.files = this.path.isDirectory
      ? readdirSync(this.path.path).filter((filename: string) => {
          const onlyDirs: boolean = this.parameters.includes("only-dirs");
          if (onlyDirs) {
            return checkFileExists(join(this.path.path, filename), true);
          }
          return true;
        })
      : undefined;

    this.create();
  }

  private incrementCurrentFileIndex = (
    incrementBy: number = 1
  ): void | null => {
    if (!this.files) {
      return null;
    }
    const indexCountLimit: number = this.files.length;
    this.currentFileIndex += incrementBy;
    if (
      this.currentFileIndex >= indexCountLimit ||
      this.currentFileIndex == 0
    ) {
      this.currentFileIndex -= incrementBy;
      return null;
    }

    if (this.logIndex > 0) {
      clearPreviousLine();
    }
    const currentFilename: string = this.files[this.currentFileIndex];
    console.log(yellowBright(`Selected ${currentFilename}`));
    this.logIndex += 1;
  };

  private create = (): any => {
    if (this.path.isDirectory) {
      try {
        chdir(this.path.path);
      } catch (excpetion: any) {
        new CommandLineException({
          message: excpetion.msg,
        });
      }
      this.directories();
    } else {
      this.openFile();
    }
  };

  private directories = () => {
    let tableData: Array<Array<string>> = [
      [
        cyanBright("Name"),
        magentaBright("Type"),
        greenBright("Extension"),
        yellowBright("Size"),
        greenBright("Modified at"),
      ],
    ];
    if (!this.files) {
      return null;
    }
    const parentDirectory = dirname(this.path.path);
    if (checkFileExists(parentDirectory, true)) {
      const statData: Stats = statSync(parentDirectory);
      tableData.push([
        cyan(".."),
        magenta("dir"),
        green("N/A"),
        yellow(`${statData.size} bytes`),
        green(statData.mtime.toString().split(" ").slice(0, 4).join(" ")),
      ]);
    }
    for (let fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
      const currentFileName: string = this.files[fileIndex];
      const fileStats: any = statSync(join(this.path.path, currentFileName));
      const fileType: string = checkFileExists(
        join(this.path.path, currentFileName),
        true
      )
        ? "dir"
        : "file";
      const extension: string =
        fileType == "dir" ? "N/A" : currentFileName.split(".").slice(-1)[0];
      const size: number = fileStats.size;
      const modifiedTime: Date = fileStats.mtime;

      tableData.push([
        cyan(currentFileName),
        magenta(fileType),
        green(extension),
        yellow(`${size} bytes`),
        green(modifiedTime.toString().split(" ").slice(0, 4).join(" ")),
      ]);
    }
    console.log(table(tableData));
    this.createInputMode();
  };

  public createInputMode = (): void => {
    const inputMode = new InputMode(
      new Map<string, Function>([
        [
          "down",
          () => {
            this.incrementCurrentFileIndex(1);
          },
        ],
        [
          "up",
          () => {
            this.incrementCurrentFileIndex(-1);
          },
        ],
        ["shift+n", KeyboardEvents.createNewDirectory],
        [
          "ctrl+b",
          () => {
            Bookmarks.add(cwd(), new Date(), this.bookmarks);
          },
        ],
        [
          "shift+b",
          () => {
            Bookmarks.displayBookmarks(this.bookmarks);
          },
        ],
        [
          "shift+p",
          () => {
            KeyboardEvents.previewMarkdown(this.path.path);
          },
        ],
        [
          "return",
          () => {
            this.switchPath();
          },
        ],
        [
          "shift+left",
          () => {
            const filename = dirname(this.path.path);
            console.clear();
            new ListFiles(
              {
                path: filename,
                exists: checkFileExists(filename, false),
                isDirectory: checkFileExists(filename, true),
              },
              [],
              false
            );
          },
        ],
        [
          "shift+up",
          () => {
            new Properties(this.path);
          },
        ],
      ])
    );
  };

  private switchPath = (): void | null => {
    if (!this.files) {
      return null;
    }
    const filename: string = join(cwd(), this.files[this.currentFileIndex]);
    const selectedFile: File = {
      path: filename,
      exists: checkFileExists(filename, false),
      isDirectory: checkFileExists(filename),
    };
    console.clear();
    new ListFiles(selectedFile, [], false);
  };

  private openFile = () => {
    readFile(
      this.path.path,
      (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
          new CommandLineException({
            message: err.message,
          });
        }
        const dataToString: string = data.toString();
        console.log(highlight(dataToString));
      }
    );
    this.createInputMode();
  };
}
