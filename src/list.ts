import { readdirSync, readFile, statSync } from "fs";
import { join } from "path";
import { checkFileExists, File } from "./utils";
import { chdir } from "process";
import { CommandLineException } from "./exception";
import { highlight } from "cli-highlight";
import { cyan, magenta, yellow, green, yellowBright } from "chalk";
import { table } from "table";
import { InputMode } from "./input";

export class ListFiles {
  private path: File;
  private files?: Array<string>;
  private parameters: Array<string>;
  private showTitle: boolean;

  private currentFileIndex: number = 0;

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

  private incrementCurrentFileIndex = (incrementBy:number=1):void | null => {
    if(!this.files){
      return null
    }
    const indexCountLimit:number = this.files.length
    this.currentFileIndex += incrementBy
    if(this.currentFileIndex >= indexCountLimit || this.currentFileIndex==0) {
      this.currentFileIndex -= incrementBy
      return null
    }

    const currentFilename:string = this.files[this.currentFileIndex]
    console.log(yellowBright(`Selected ${currentFilename}`))
  }

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
        cyan("Name"),
        magenta("Type"),
        green("Extension"),
        yellow("Size"),
        green("Modified at"),
      ],
    ];
    if (!this.files) {
      return null;
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
    this.createInputMode()
  };

  private createInputMode = ():void => {
    const inputMode = new InputMode(
      new Map<string, Function>([
        [
          "down",
          () => {
            this.incrementCurrentFileIndex(1)
          },
        ],
        [
          "up", 
          () => {
            this.incrementCurrentFileIndex(-1)
          }
        ]
      ])
    );
  }

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
  };
}
