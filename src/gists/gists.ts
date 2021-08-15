import { Github } from "./gh";
import { Octokit } from "@octokit/core";
import { blueBright, greenBright, redBright, yellowBright } from "chalk";
import { InputMode } from "../input";

export class GithubGist {
  private client: Octokit;
  private github: Github;
  private token: string;
  private fileIndex: number = -1;
  private addedInputs: boolean = false;

  constructor(parameters: Array<string>) {
    this.github = new Github();
    this.token = this.github.getPersonalAccessToken();
    this.client = new Octokit({ auth: this.token });

    const command: string | undefined = parameters[0];
    if (command == "reset") {
      this.github.reset();
      process.exit();
    } else {
      this.github
        .authenticate(this.client)
        .then((value: any): void => {
          this.displayGists(this.client);
        })
        .catch((error: any) => {
          console.log(redBright(error));
          process.exit();
        });
    }
  }

  private incrementFileIndex = (by: number, limit: Array<any>): void => {
    if (this.fileIndex == -1 || this.fileIndex == limit.length - 1) {
      return;
    }
    this.fileIndex += by;
    console.log(yellowBright(`Selected ${limit[this.fileIndex]}`));
  };

  private displayGists = (client: Octokit): void => {
    const data = this.client.request("GET /gists");
    data
      .then((response: any): void => {
        const data = response.data;
        const gists: Array<any> = Array.from(data).map((element: any): any => {
          return element.id;
        });
        gists.forEach((element: any, index: number): void => {
          client
            .request("GET /gists/{gist_id}", { gist_id: element })
            .then((response: any): void => {
              const title: string = response.data.description
                ? response.data.description
                : element;
              console.log(`${yellowBright(index + 1)}: ${greenBright(title)}`);
            })
            .catch((error: any): void => {});
        });
        this.addKeys(gists);
      })
      .catch((error: any): void => {
        console.log(redBright(error));
        process.exit();
      });
  };

  private addKeys = (gists: Array<any>): void => {
    if (this.addedInputs) {
      return;
    }
    const input = new InputMode(
      new Map<string, Function>([
        [
          "up",
          () => {
            this.incrementFileIndex(1, gists);
          },
        ],
        [
          "down",
          () => {
            this.incrementFileIndex(-1, gists);
          },
        ],
      ])
    );
    this.addedInputs = true;
    return;
  };
}
