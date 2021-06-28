import { cyanBright, redBright, yellowBright } from "chalk";
import { Client } from "discord-rpc";
import { readFileSync, writeFile, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { stdin, stdout } from "process";
import { createInterface, Interface } from "readline";
import { CommandLineException } from "../exception";
import { RichPresenceSettings } from "./settings";

export class TermexDiscordRPC {
  private client: Client = new Client({ transport: "ipc" });
  private startTimestamp: Date = new Date();
  private clientId: string | null = RichPresenceSettings.getClientId();

  /**
   * @constructor
   * Login using the discord client Id stored in the settings file
   */
  constructor() {
    const clientId = this.clientId;
    if (clientId != null) {
      this.client.login({ clientId }).catch((reason: any): void => {});
    }
  }

  /**
   * @public
   * @param filename
   *
   * Set the use activity based on the filename passed in
   *
   * @returns
   */
  public setActivity = async (filename: string): Promise<any> => {
    if (!this.client) {
      return null;
    }
    this.client
      .setActivity({
        details: `Termex`,
        state: `Messing up with ${filename}`,
        startTimestamp: this.startTimestamp,
        largeImageKey: "termex",
        largeImageText: "Termex",
        // smallImageKey: 'snek_small',
        // smallImageText: 'i am my own pillows',
        instance: false,
      })
      .catch((reason: any): void => {});
  };

  /**
   * @public
   * @param {string} filename The filename to display in the rpc
   * @returns
   */
  public start = (filename: string): any => {
    if (!this.clientId) {
      return null;
    }
    this.createRichPresence(this.clientId, filename);
  };

  private createRichPresence = (
    clientId: string,
    filename: string
    // timeout: number = 15e3
  ): void => {
    this.setActivity(filename);
  };
}

export class RichPresenceSetup {
  private parameters: Array<string>;
  private readlineInterface: Interface = createInterface({
    input: stdin,
    output: stdout,
  });

  /**
   * @constructor
   * @param {string[]} parameters The parameters passed in along with the command. Checks
   * for --enable flag and enables Discord RPC
   */
  constructor(parameters: Array<string>) {
    this.parameters = parameters;

    const enable = this.parameters.includes("enable");
    if (enable) {
      this.enableRichPresence();
    } else {
      this.displayStatus();
    }
  }

  private displayStatus = (): any => {
    const clientId: string | null = RichPresenceSettings.getClientId();
    if (!clientId) {
      console.log(`${cyanBright("Enabled:")} ${redBright("False")}`);
      process.exit();
    }
    console.log(`${cyanBright("Enabled:")} ${yellowBright("True")}`);
  };

  private enableRichPresence = (): any => {
    const clientId: string | null = RichPresenceSettings.getClientId();
    if (clientId != null) {
      console.log(yellowBright("RPC is already enabled"));
      process.exit();
    }
    const numbers: Array<string> = Array.from(Array(10).keys()).map(
      (value: number): string => {
        return value.toString();
      }
    );
    const key = this.readlineInterface.question(
      cyanBright("Client Id [?] "),
      (solution: string): void => {
        const match: Array<string> = solution
          .trim()
          .split("")
          .filter((value: string): boolean => {
            return numbers.includes(value);
          });
        if (match.length != solution.length) {
          new CommandLineException({
            message: "Invalid client id",
          });
        }
        writeFile(
          RichPresenceSettings.settingsFile,
          solution.trim(),
          (error: NodeJS.ErrnoException | null): any => {
            if (error) {
              new CommandLineException({ message: error.toString() });
            }
          }
        );
        this.readlineInterface.close();
      }
    );
  };
}

// const key = RichPresenceSettings.getClientId()
// console.log(key)
// const r = new TermexDiscordRPC().createRichPresence("", "lmao")
