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
import { command } from "./command";
import { Ignores } from "./ignore";
import { displayImage } from "./image";
import open = require("open");
import { TermexHistory } from "./history";
import { isBinaryFileSync } from "isbinaryfile";
import { TermexDiscordRPC } from "./discord/rpc";

export class ListFiles {
  private path: File;
  private files?: Array<string>;
  private parameters: Array<string>;
  private showTitle: boolean;
  private addedEventListener: boolean = false;

  private currentFileIndex: number = 0;
  private bookmarks: Bookmarks = new Bookmarks();
  private logIndex: number = 0;

  private rpc: TermexDiscordRPC = new TermexDiscordRPC();

  constructor(
    path: File,
    parameters: Array<string>,
    showTitle: boolean = true
  ) {
    this.path = path;
    this.parameters = parameters;
    this.showTitle = showTitle;
    this.files = this.createFiles();
    this.filterIgnore();

    setInterval((): void => {
      this.rpc.start(this.path.path);
      console.log(this.path.path);
    }, 15e3);

    this.create();
  }

  private createFiles = () => {
    return this.path.isDirectory
      ? readdirSync(this.path.path).filter((filename: string) => {
          const onlyDirs: boolean = this.parameters.includes("only-dirs");
          if (onlyDirs) {
            return checkFileExists(join(this.path.path, filename), true);
          }
          return true;
        })
      : undefined;
  };

  private filterIgnore = () => {
    if (this.parameters.includes("ignore")) {
      const ignoreFiles: Array<File> = new Ignores()
        .ignoreFiles(this.path)
        .filter((value: File): boolean => {
          return this.path.path != value.path;
        });
      this.files = this.files.filter((value: string): boolean => {
        const filePath: string = join(this.path.path, value);
        for (let index = 0; index < ignoreFiles.length; index++) {
          if (ignoreFiles[index].path == filePath) {
            return false;
          }
        }
        return true;
      });
    }
  };

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
    TermexHistory.add({
      filename: this.path.path,
      time: new Date(),
      isDirectory: this.path.isDirectory,
    });
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
      let currentFileName: string = this.files[fileIndex];
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
        cyan(
          currentFileName.length >= 30
            ? currentFileName.slice(0, 30 - currentFileName.length - 3) + ".."
            : currentFileName
        ),
        magenta(fileType),
        green(extension),
        yellow(`${size} bytes`),
        green(modifiedTime.toString().split(" ").slice(0, 4).join(" ")),
      ]);
    }
    console.log(table(tableData));
    this.createInputMode();
  };

  public createInputMode = (): any => {
    if (this.addedEventListener) {
      return null;
    }
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
            Bookmarks.add(cwd(), new Date(), this.bookmarks, this.logIndex);
            this.logIndex += 1;
          },
        ],
        [
          "shift+b",
          () => {
            Bookmarks.displayBookmarks(this.bookmarks, this.logIndex);
            this.logIndex += 1;
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
            this.switchPath(dirname(this.path.path));
          },
        ],
        [
          "shift+up",
          () => {
            new Properties(this.path);
          },
        ],
        [
          "insert",
          () => {
            command(this.path);
          },
        ],
        ["ctrl+c", process.exit],
      ])
    );
    this.addedEventListener = true;
  };

  private switchPath = (file?: string): void | null => {
    if (!this.files) {
      return null;
    }
    const filename: string =
      file || join(cwd(), this.files[this.currentFileIndex]);
    let selectedFile: File = {
      path: filename,
      exists: checkFileExists(filename, false),
      isDirectory: checkFileExists(filename),
    };

    const isBinary: boolean = selectedFile.isDirectory
      ? false
      : isBinaryFileSync(filename);
    if (isBinary) {
      selectedFile = this.path;
    }

    console.clear();
    this.path = selectedFile;
    this.files = this.createFiles();
    this.currentFileIndex = 0;
    this.create();
    if (isBinary) {
      console.log(yellowBright("Cannot open binary files"));
      open(filename);
    }
  };

  /**
   * @private
   *
   * Check if an image has a valid image
   * extension
   *
   * @param path The path of the file
   * @returns {boolean} If the file path has a valid image extension
   */
  private isDisplayableImage = (path: string): boolean => {
    const extensions: Array<string> = ["png", "jpeg", "jpg", "gif"];
    const extension: string = path.split(".").slice(-1)[0];
    return extensions.includes(extension);
  };

  private openFile = (): any => {
    if (this.isDisplayableImage(this.path.path)) {
      console.log(yellow("Opening image..."));
      open(this.path.path);
      return null;
    }
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
