import {
  cyanBright,
  greenBright,
  magenta,
  magentaBright,
  yellowBright,
  cyan,
  yellow,
  green
} from "chalk";
import { readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { table } from "table";
import { checkFileExists } from "./utils";

export interface HistoryObject {
  filename: string;
  time: Date;
  isDirectory: boolean;
}
export class TermexHistory {
  private static readonly filename: string = join(
    homedir(),
    ".termex",
    "history"
  );

  public static add = (historyObject: HistoryObject): void => {
    const json = JSON.stringify(historyObject);
    let data = TermexHistory.readFromHistory() as Array<any>;
    data.push(json);
    TermexHistory.writeFile(JSON.stringify(data));
  };

  private static setup = (): void => {
    if (!checkFileExists(TermexHistory.filename, false)) {
      TermexHistory.writeFile(JSON.stringify([]));
    }
  };

  public static readFromHistory = (): Array<any> => {
    TermexHistory.setup();
    const content: string = readFileSync(TermexHistory.filename).toString();
    try {
      const json = JSON.parse(content);
      return json as Array<any>;
    } catch (exception: any) {
      TermexHistory.writeFile(JSON.stringify([]));
      return [];
    }
  };

  public static writeFile = (content: string): void => {
    writeFileSync(TermexHistory.filename, content);
  };
}

export const displayHistory = (): void => {
  const data: Array<HistoryObject> = TermexHistory.readFromHistory().map(
    (element: string): HistoryObject => {
      return JSON.parse(element) as HistoryObject;
    }
  );
  const tableData: Array<Array<string>> = [
    [
      cyanBright("Path"),
      magentaBright("Type"),
      yellowBright("Exists?"),
      greenBright("Saved at"),
    ],
  ];
  for (let index = 0; index < data.length; index++) {
    const currentObject: HistoryObject = data[index];
    const currentFileName = currentObject.filename
    tableData.push([
      cyan(currentFileName.length >= 30
              ? currentFileName.slice(0, 30 - currentFileName.length - 3) + ".."
              : currentFileName),
      magenta(currentObject.isDirectory ? "dir" : "file"),
      yellow(checkFileExists(
              currentObject.filename,
              currentObject.isDirectory
            ).toString()),
      green(currentObject.time.toString().split(" ").slice(0, 4).join(" ")),
    ]);
  }
  console.log(table(tableData));
};
