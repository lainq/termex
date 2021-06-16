import { stdin, stdout } from "process";
import { createInterface, Interface } from "readline";

interface PromptOptions {
  // The prompt message
  prompt: string;
  // The query character
  character: string;
  // The callback function to be executed
  // after recieving input
  callback?: Function;
  // Any options
  options?: Array<string>;
}

export class Prompt {
  private readonly promptQuery: string;
  private readonly queryCharacter: string;
  private callback?: Function;
  private options?: Array<string>;

  // The readline interface used to read data
  // from the command line
  private readlineInterface: Interface = createInterface({
    input: stdin,
    output: stdout,
  });

  constructor(options: PromptOptions) {
    this.promptQuery = options.prompt;
    this.queryCharacter = options.character;
    this.callback = options.callback;
    this.options = options.options;

    this.createPrompt();
  }

  private createPrompt = (): void => {
    this.readlineInterface.question(
      this.createPromptString(),
      (answer: string): void => {
        if (this.callback) {
          this.callback(answer);
        }
      }
    );
  };

  private createPromptString = (): string => {
    let prompt: string = `${this.promptQuery} ${this.queryCharacter}`;
    let optionString: string = "";
    if (this.options) {
      for (let index = 0; index < this.options.length; index++) {
        optionString += `${this.options[index]}, `;
      }
    }
    prompt =
      optionString.trim().length == 0 ? prompt : `${prompt}[${optionString}]`;
    return `${prompt} `;
  };
}
