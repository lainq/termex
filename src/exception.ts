import { redBright, yellowBright } from "chalk";

interface ErrorMessage {
  // The error message
  message: string;
  // Any suggestion that can help in solving
  // the issue
  suggestion?: string;
}

export class CommandLineException {
  private readonly message: string;
  private readonly suggestion?: string;

  /**
   * @constructor
   * @param {ErrorMessage} message The error message and the suggestion message
   * @param {boolean} isFatal Whether the program should exit after throwing the errpr
   * @param {number} exitStatusCode The exit status code
   */
  constructor(
    message: ErrorMessage,
    isFatal: boolean = true,
    exitStatusCode: number = 1
  ) {
    this.message = message.message;
    this.suggestion = message.suggestion;
    this.throw(isFatal, exitStatusCode);
  }

  private throw(isFatal: boolean, exitStatusCode: number) {
    console.log(redBright(this.message));
    if (this.suggestion) {
      console.log(yellowBright(this.suggestion));
    }
    if (isFatal) {
      process.exit(exitStatusCode);
    }
  }
}
