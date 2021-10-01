import { yellowBright } from "chalk";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { Ignores } from "./ignore";
import { checkFileExists, File } from "./utils";

export class Walk {
  public files: Array<string> = new Array<string>();
  private path: string;
  private ignores: Array<File>;

  /**
   * @constructor
   * @param path The path to scan the directories
   * @param parameters The parameters passed in
   */
  constructor(path: string, parameters: Array<string>) {
    this.path = path;
    this.ignores = parameters.includes("ignore")
      ? new Ignores().ignoreFiles({
          path: this.path,
          exists: true,
          isDirectory: checkFileExists(this.path, true),
        })
      : new Array<File>();
    console.log(yellowBright("Scanning..."));
    this.walk(this.path);
  }

  private walk = (path: string): void => {
    const content: Array<string> = readdirSync(path);
    for (let contentIndex = 0; contentIndex < content.length; contentIndex++) {
      try {
        const currentFile: string = join(path, content[contentIndex]);
        const isDirectory: boolean = statSync(currentFile).isDirectory();
        const ignore: any = this.ignores.filter((ignoreFile: File): boolean => {
          return (
            ignoreFile.path == currentFile &&
            ignoreFile.isDirectory == isDirectory
          );
        });
        if (ignore.length > 0) {
          continue;
        }
        if (!isDirectory) {
          this.files.push(currentFile);
          continue;
        }
        if (content[contentIndex] == ".git") {
          continue;
        }
        this.walk(currentFile);
      } catch (exception) {}
    }
  };
}
