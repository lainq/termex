import { blueBright, Chalk, greenBright, redBright, yellowBright } from "chalk";
import { readdirSync, readFileSync } from "fs";
import { basename, join } from "path";
import { checkFileExists, clearPreviousLine, File } from "./utils";

interface FindResults<ResultType> {
  data?: Array<ResultType>;
  indices?: ReadonlyArray<number>;
}

const displaySearchResults = (
  file: File,
  results: FindResults<File | string>
) => {
  const NO_RESULTS_MESSAGE: string = "Couldn't find anything";
  if (file.isDirectory) {
    const chalks: Array<string | File> = results.data;
    if (chalks.length == 0) {
      console.log(yellowBright(NO_RESULTS_MESSAGE));
      return null;
    }
    let outputString: string = "";
    for (let index = 0; index < chalks.length; index++) {
      const chalk: string | File = chalks[index];
      if (index % 5 == 0 && index != 0) {
        outputString += "\n";
      }
      if (typeof chalk == "string") {
        continue;
      }
      const color: Chalk = chalk.isDirectory ? blueBright : greenBright;
      outputString +=
        color(basename(chalk.path)) + (index + 1 == chalks.length ? "" : "\n");
    }
    clearPreviousLine();
    console.log(yellowBright("Here's your results 👇\n"));
    console.log(outputString);
  } else {
    const resultCount: number = results.data ? results.data.length : 0;
    clearPreviousLine();
    console.log(
      yellowBright(`Found ${resultCount == 0 ? "No" : resultCount} results`)
    );
  }
};

export const find = (file: File, findData: string): any => {
  let results: FindResults<string | File> = {};
  if (file.isDirectory) {
    const matches: Array<File> = readdirSync(file.path)
      .filter((value: string): boolean => {
        return value.includes(findData.trim());
      })
      .map((value: string): File => {
        const path: string = join(file.path, value);
        return {
          path: path,
          exists: true,
          isDirectory: checkFileExists(path, true),
        };
      });
    results.data = matches;
  } else {
    try {
      const fileContent: string = readFileSync(file.path).toString();
      const words: Array<string> = fileContent
        .replace("\n\r", " ")
        .split(" ")
        .filter((value: string): boolean => {
          return value.includes(findData);
        });
      results.data = words;
    } catch (exception: any) {
      console.log(redBright(exception));
    }
  }
  displaySearchResults(file, results);
};
