import { redBright, yellowBright } from "chalk";
import { Client } from "discord-rpc";
import { readFileSync, writeFile } from "fs";
import { homedir } from "os";
import { join } from "path";
import { checkFileExists } from "../utils";

export class RichPresenceSettings {
  public static readonly settingsFile: string = join(
    homedir(),
    ".termex",
    ".rpc"
  );

  public static getClientId = (): string | null => {
    if (!checkFileExists(RichPresenceSettings.settingsFile, false)) {
      return null;
    }
    const key: string = readFileSync(RichPresenceSettings.settingsFile)
      .toString()
      .trim();
    return key.length == 0 ? null : key;
  };
}

export class RichPresenceSetup {
  private parameters: Array<string>;

  constructor(parameters: Array<string>) {
    this.parameters = parameters;

    const enable = this.parameters.includes("enable");
    if (enable) {
    }
  }
}

export class TermexDiscordRPC {
  private client: Client = new Client({ transport: "ipc" });
  private startTimestamp: Date = new Date();

  private setActivity = async (filename: string): Promise<any> => {
    if (!this.client) {
      console.log("No client");
      return null;
    }
    this.client.setActivity({
      details: `Termex`,
      state: `Messing up with ${filename}`,
      startTimestamp: this.startTimestamp,
      largeImageKey: "termex",
      largeImageText: "Termex",
      // smallImageKey: 'snek_small',
      // smallImageText: 'i am my own pillows',
      instance: false,
    });
  };

  public createRichPresence = (
    clientId: string,
    filename: string,
    timeout: number = 15e3
  ): void => {
    this.client.on("ready", (): void => {
      this.setActivity(filename);
      console.log(yellowBright("Discord RPC has started"));
      setInterval(() => {
        this.setActivity(filename);
      }, timeout);
    });

    this.client.login({ clientId }).catch((reason: any): void => {});
  };
}

// const key = RichPresenceSettings.getClientId()
// console.log(key)
// const r = new TermexDiscordRPC().createRichPresence("", "lmao")
