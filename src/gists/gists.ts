import { Github } from "./gh";
import { Octokit } from "@octokit/core";
import { blueBright, greenBright, redBright, yellowBright } from "chalk";
import { InputMode } from "../input";
import { clearPreviousLine } from "../utils";
import boxen from "boxen";
import highlight from "cli-highlight";
import { CreateGist } from "./create";

export class GithubGist {
  private client: Octokit;
  private github: Github;
  private token: string;
  private fileIndex: number = -1;
  private addedInputs: boolean = false;
  private logged: boolean = false;

  constructor(parameters: Array<string>) {
    this.github = new Github();
    this.token = this.github.getPersonalAccessToken();
    this.client = new Octokit({ auth: this.token });

    const command: string | undefined = parameters[0];
    if (command == "reset") {
      this.github.reset();
      process.exit();
    } else if (command == "new") {
      new CreateGist(this.client);
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
    this.fileIndex += by;
    if (!limit[this.fileIndex]) {
      this.fileIndex -= 1;
      return;
    }
    if (!this.logged) {
      console.log("\n");
      clearPreviousLine();
    }
    clearPreviousLine();
    console.log(yellowBright(`Selected ${limit[this.fileIndex]}`));
    this.logged = true;
  };

  private displayGists = (client: Octokit): void => {
    console.log("Fetching gists....");
    const data = this.client.request("GET /gists");
    data
      .then((response: any): void => {
        const data = response.data;
        const gists: Array<any> = Array.from(data).map((element: any): any => {
          return element.id;
        });
        clearPreviousLine();
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

  private selectFile = (gists: Array<any>): void => {
    const selectedGist: string = gists[this.fileIndex];
    this.client
      .request("GET /gists/{gist_id}", { gist_id: selectedGist })
      .then((response: any): void => {
        const files: any = response.data.files;
        const filenames: Array<string> = Object.keys(files);
        for (let index = 0; index < filenames.length; index++) {
          const file = files[filenames[index]];
          console.log(yellowBright(file.filename));
          console.log(boxen(highlight(file.content), { padding: 1 }));
        }
      })
      .catch((error: any): void => {
        console.log(redBright(error));
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
            this.incrementFileIndex(-1, gists);
          },
        ],
        [
          "down",
          () => {
            this.incrementFileIndex(1, gists);
          },
        ],
        [
          "ctrl+c",
          () => {
            process.exit();
          },
        ],
        [
          "return",
          () => {
            this.selectFile(gists);
          },
        ],
      ])
    );
    this.addedInputs = true;
    return;
  };
}
