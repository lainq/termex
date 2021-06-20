import boxen from "boxen";
import { cyanBright, greenBright, yellowBright } from "chalk";
import { ENODEV } from "constants";
import { readdirSync, readFileSync } from "fs";
import { basename, join } from "path";
import { File } from "./utils";

class EnvFileParser {
  private readonly filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  public env = (): Map<string, string> => {
    const fileContent: Buffer = this.readFile(this.filename);
    const variables: Map<string, string> = this.createEnvironmentVariables(
      fileContent.toString().split("\n")
    );
    return variables;
  };

  private createEnvironmentVariables = (
    lines: Array<string>
  ): Map<string, string> => {
    let parseLines: Array<string> = lines.filter(
      (currentLine: string): boolean => {
        return !currentLine.startsWith("#");
      }
    );
    let variables: Map<string, string> = new Map<string, string>();
    for (let index = 0; index < parseLines.length; index++) {
      const currentLine: string = parseLines[index].trim();
      if (currentLine.length == 0) {
        continue;
      }
      const split = currentLine
        .split("=")
        .filter((element: string): boolean => {
          return element.length != 0;
        });
      if (split.length <= 1) {
        continue;
      }
      let key: string = split[0].trim();
      let value: string = split.slice(1).join("=").trim();
      variables.set(key, value);
    }
    return variables;
  };

  private readFile = (filename: string): Buffer => {
    try {
      return readFileSync(filename);
    } catch {
      return new Buffer("");
    }
  };

  public static createMapString = <Key, Value>(
    data: Map<Key, Value>,
    joinCharacter: string
  ): string => {
    let mapArray: Array<string> = new Array<string>();
    let keys: Array<Key> = Array.from(data.keys());
    for (let index = 0; index < keys.length; index++) {
      const key: Key = keys[index];
      mapArray.push(`${cyanBright(key)} = ${greenBright(data.get(key))}`);
    }
    mapArray.push("\n");
    return mapArray.join(joinCharacter);
  };
}

export class EnvironmentVariables {
  private readonly files: Array<string>;
  private readonly path: string;

  constructor(files: Array<string>, path: string) {
    this.files = files;
    this.path = path;

    const env: Array<string> = this.findEnvFiles();
    let envString: string = this.createEnvString(env);
    console.clear();

    if(envString.trim().length == 0){
      envString = "No .env files found"
    }

    console.log(
      boxen(envString, {
        margin: 2,
        padding: 2,
        borderStyle: "classic",
        borderColor: "yellowBright",
      })
    );
  }

  private createEnvString = (files: Array<string>): string => {
    let envString: string = "";
    for (let index = 0; index < files.length; index++) {
      const file: string = files[index];
      const variables: Map<string, string> = new EnvFileParser(file).env();
      if (variables.size > 0) {
        envString += EnvFileParser.createMapString<string, string>(
          variables,
          "\n"
        );
      }
    }
    return envString;
  };

  private findEnvFiles = (): Array<string> => {
    return this.files
      .filter((filename: string): boolean => {
        return filename == ".env";
      })
      .map((currentFilename: string): string => {
        return join(this.path, currentFilename);
      });
  };

  public static create(file: File): null | void {
    if (!file.isDirectory) {
      return null;
    }
    const env = new EnvironmentVariables(readdirSync(file.path), file.path);
  }
}
