import { text } from "figlet";
import { cwd } from "process";
import { ArgumentParser, ArgumentParserResults } from "./src/arguments";
import { ContentPercent } from "./src/content";
import { CommandLineException } from "./src/exception";
import { displayHistory, TermexHistory } from "./src/history";
import { SetupTermex } from "./src/setup";
import { reportIssue } from "./src/issue";
import { RichPresenceSetup } from "./src/discord/rpc";
import { writeFile } from "fs";
import { yellowBright } from "chalk";
import { RichPresenceSettings } from "./src/discord/settings";
import { openLast } from "./src/last";
import { initializeTermex } from "./src/init";
import { DirectoryFiles } from "./src/files";
import open = require("open");

const createTitle = (titleString: string = "Termex"): void => {
  text(
    "Termex",
    {
      font: "Ghost",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    },
    (error: Error, result?: string) => {
      if (error) {
        return null;
      }
      console.log(result);
    }
  );
};

const performCommand = (result: ArgumentParserResults): Function => {
  const command = result.command;
  if (!command) {
    return (): void => {
      initializeTermex(cwd(), result.parameters);
    };
  }
  if (command == "help") {
    return (): void => {
      open("https://github.com/pranavbaburaj/termex/tree/main/docs");
    };
  } else if (command == "history") {
    return displayHistory;
  } else if (
    ["%", "percent", "percentage", "polyglot"].includes(command.trim())
  ) {
    return () => {
      new ContentPercent(result.parameters);
    };
  } else if (["issue", "report"].includes(command)) {
    return reportIssue;
  } else if (command == "rpc") {
    return () => {
      const rpc = new RichPresenceSetup(result.parameters);
    };
  } else if (command == "no-rpc") {
    return () => {
      writeFile(
        RichPresenceSettings.settingsFile,
        "",
        (error: NodeJS.ErrnoException | null): any => {
          if (!error) {
            console.log(yellowBright(`Disabled RPC`));
            return null;
          }
          new CommandLineException({
            message: "Failed to disable rpc",
          });
        }
      );
    };
  } else if (command == "last") {
    return openLast;
  } else if (command == "clear-history") {
    return () => {
      TermexHistory.writeFile(JSON.stringify([]));
      console.log(yellowBright("Cleared your termex history"));
    };
  } else if (command == "files") {
    return () => {
      const files = new DirectoryFiles(process.cwd(), result.parameters);
    };
  }
  return (): void => {
    initializeTermex(command, result.parameters);
  };
};

const setup = SetupTermex.createSetup();
const argumentParser: ArgumentParserResults =
  new ArgumentParser().parseArguments();
const execute: Function = performCommand(argumentParser);

const executeResults: any = execute();
