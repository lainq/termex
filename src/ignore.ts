import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { checkFileExists, File } from "./utils";
import { CommandLineException } from "./exception";

export class Ignores {
  public ignoreFiles = (path: File) => {
    if (!path.isDirectory) {
      new CommandLineException({
        message: "--ignore can only be used with directories",
      });
    }
    const data = this.parse(
      path.path,
      this.findGitignore(path.path)
        .split("\r\n")
        .filter((line: string): boolean => {
          return !line.startsWith("#");
        })
    );
    return data;
  };

  private parse = (path: string, data: Array<string>): Array<File> => {
    let files: Array<File> = new Array<File>();
    let content: Array<string> = readdirSync(path);
    for (let index = 0; index < data.length; index++) {
      const line: string = data[index].trim();
      if (line.startsWith(".")) {
        const match: Array<File> = content
          .filter((currentFilename: string): boolean => {
            return currentFilename.endsWith(line);
          })
          .map((value: string): File => {
            const completePath: string = join(path, value);
            return {
              path: completePath,
              exists: true,
              isDirectory: checkFileExists(completePath, true),
            };
          });
        files.push(...match);
      } else if (line.endsWith("/")) {
        const completePath: string = join(path, line.slice(0, -1));
        const exists: boolean = checkFileExists(completePath);
        files.push({
          path: completePath,
          exists: exists,
          isDirectory: exists,
        });
      } else {
        const completePath: string = join(path, line);
        files.push({
          path: completePath,
          exists: checkFileExists(completePath, false),
          isDirectory: false,
        });
      }
    }
    return files.filter((element: File): boolean => {
      return element.path != path;
    });
  };

  private findGitignore = (path: string): string => {
    if (!readdirSync(path).includes(".ignore")) {
      return "";
    }
    const filepath: string = join(path, ".ignore");
    try {
      return readFileSync(filepath).toString();
    } catch {
      return "";
    }
  };
}
