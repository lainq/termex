import { cyanBright, redBright, yellowBright } from "chalk";
import { Client } from "discord-rpc";
import { readFileSync, writeFile, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { stdin, stdout } from "process";
import { createInterface, Interface } from "readline";
import { CommandLineException } from "../exception";
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


export class RichPresenceSetup {
  private parameters: Array<string>;
  private readlineInterface:Interface = createInterface({
    input: stdin,
    output: stdout
  })

  constructor(parameters: Array<string>) {
    this.parameters = parameters;

    const enable = this.parameters.includes("enable");
    if (enable) {
      this.enableRichPresence()
    } else {
      this.displayStatus()
    } 
    process.exit()
  }

  private displayStatus = ():any => {
    const clientId:string | null = RichPresenceSettings.getClientId()
    if(!clientId){
      console.log(`${cyanBright("Enabled:")} ${redBright("False")}`)
      process.exit()
    }
    console.log(`${cyanBright("Enabled:")} ${yellowBright("True")}`)
  }

  private enableRichPresence = ():any => {
    const clientId:string | null = RichPresenceSettings.getClientId()
    if(clientId != null){
      console.log(yellowBright("RPC is already enabled"))
      process.exit()
    }
    const numbers:Array<string> = Array.from(Array(10).keys()).map((value:number):string => {return value.toString()})
    const key = this.readlineInterface.question(cyanBright("Client Id [?] "), (solution:string):void => {
      const match:Array<string> = solution.trim().split("").filter((value:string):boolean => {
        return numbers.includes(value)
      })
      if(match.length != solution.length){
        new CommandLineException({
          message: "Invalid client id"
        })
      }
      writeFile(RichPresenceSettings.settingsFile, solution.trim(), (error:NodeJS.ErrnoException | null):any => {
        if(error){
          new CommandLineException({message:error.toString()})
        }
      })
      this.readlineInterface.close()
    })
  }
}

// const key = RichPresenceSettings.getClientId()
// console.log(key)
// const r = new TermexDiscordRPC().createRichPresence("", "lmao")
