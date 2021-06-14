import { argv } from "process";
import { CommandLineException } from "./exception";

export interface ArgumentParserResults {
  // The command that the user wants to run
  // Eg := tree, run, list, help etc
  // if the length of the arguments is 0
  // The details about the current working directory
  // is displayed
  command: string | null;
  // The flags passed in along with the command
  // Eg := --only-dirs, --gitignore
  // Flags should start with double hiphens(--)
  parameters: Array<string>;
}

export class ArgumentParser {
  // The list of command line arguments
  private readonly arguments: Array<string> = argv.slice(2);

  /**
   * @oublic
   *
   * The argument parser function that
   * parses the list if command line arguments
   * into commands and parameters(or flags)
   *
   * @returns {ArgumentParserResults} The command and the flags
   */
  public parseArguments(): ArgumentParserResults {
    let command: string | null = null;
    let parameters: Array<string> = new Array<string>();
    for (let index = 0; index < this.arguments.length; index++) {
      const currentArgument: string = this.arguments[index];
      if (index == 0) {
        // If the length of the list is greater than 0
        // The first element of the list is taken as the
        // command
        command = currentArgument;
        continue;
      }
      const isValidArgument: boolean = currentArgument.startsWith("--");
      if (!isValidArgument) {
        const error = new CommandLineException({
          message: `${currentArgument} is not a valid argument`,
          suggestion: "Parameter keys should start with --",
        });
      }
      parameters.push(currentArgument.slice(2));
    }
    return { command: command, parameters: parameters };
  }
}
