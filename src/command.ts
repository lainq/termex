import { cyan, yellowBright } from "chalk";
import { basename } from "path";
import { ArgumentParserResults } from "./arguments";
import { ContentPercent } from "./content";
import { EnvironmentVariables } from "./env";
import { CommandLineException } from "./exception";
import { find } from "./find";
import { Prompt } from "./prompt";
import { File } from "./utils";

const commands: Map<string, Function> = new Map<string, Function>([
  [
    // Read data from all.env files in the current directory
    "env",
    (file: File, parameters: Array<string>): void => {
      EnvironmentVariables.create(file);
    },
  ],
  [
    // find a specific file from the current directory
    "find",
    (file: File, parameters: Array<string>): any => {
      let trimmedParameters: Array<string> = parameters
        .map((value: string): string => {
          return value.trim();
        })
        .filter((value: string): boolean => {
          return value.length > 0;
        });
      if (trimmedParameters.length == 0) {
        console.log(yellowBright(`Couldn't find results`));
        return null;
      }
      console.clear();
      const searchParameter: string = trimmedParameters.join(" ");
      console.log(
        yellowBright(
          `Searching for "${searchParameter}" in ${basename(file.path)}`
        )
      );
      const searchResults = find(file, searchParameter);
    },
  ],
  [
    // Get the percentage of differnt types of files used in
    // the current directory.
    "%",
    (file: File, parameters: Array<string>): any => {
      if (!file.isDirectory) {
        console.log(
          yellowBright("% command can only be used inside of directories")
        );
        return null;
      }
      const percent = new ContentPercent(parameters, file.path);
    },
  ],
]);

interface ParseResults extends ArgumentParserResults {}

class ParseCommands {
  private command: string;

  constructor(command: string, file: File) {
    this.command = command;

    const results: ParseResults = this.createCommand();
    this.executeCommands(results, file);
  }

  private executeCommands = (
    results: ParseResults,
    file: File
  ): void | null => {
    const command = results.command;
    if (command.length == 0) {
      return null;
    }
    if (!Array.from(commands.keys()).includes(command)) {
      new CommandLineException(
        {
          message: `${command} is not a valid command`,
        },
        false
      );
      return null;
    }
    const executeFunction: Function = commands.get(command);
    if (executeFunction) {
      executeFunction(file, results.parameters);
    }
  };

  private createCommand = (): ParseResults => {
    const split: Array<string> = this.command.split(" ");
    let command = "";
    let parameters: Array<string> = new Array<string>();
    for (let index = 0; index < split.length; index++) {
      if (index == 0) {
        command = split[index];
        continue;
      }
      parameters.push(split[index]);
    }
    return { command: command, parameters: parameters };
  };
}

export const command = (file: File): void => {
  new Prompt({
    prompt: "",
    character: "[?]",
    callback: (userInput: string): void => {
      new ParseCommands(userInput, file);
    },
  });
};
