import { Prompt } from "./prompt";
import { cyanBright } from "chalk";
import open = require("open");

const createUrl = (issue: string): string => {
  return `https://github.com/pranavbaburaj/termex/issues/new?assignees=&template=bug_report.md&title=${issue}`;
};

export const reportIssue = () => {
  new Prompt({
    prompt: cyanBright("What's the issue that you face"),
    character: cyanBright("[?]"),
    callback: (userInput: string): void => {
      open(createUrl(userInput.trim().replace(" ", "+")));
    },
    exitPrompt: true,
  });
};
