import { redBright } from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import { homedir } from "os";
import { join } from "path";

export class DropBoxSetup {
    public readonly filepath:string = join(homedir(), ".termex", ".dropbox")
    constructor() {
        if(!existsSync(this.filepath)) { writeFileSync(this.filepath, "") }
    }

    public getAccessToken = ():string => {
        let token:string =  Buffer.from(readFileSync(this.filepath).toString(), "base64").toString("utf8").trim()
        if(token.length == 0) { this.accessTokenSetup() }
        token = Buffer.from(readFileSync(this.filepath).toString(), "base64").toString("utf8")
        return token
    }

    private accessTokenSetup = ():void => {
        inquirer.prompt({type:"input", name:"token", message:"Access Token"}).then((response:{token:any}):void => {
            if(response.token.trim().length != 0) {
                writeFileSync(this.filepath, Buffer.from(response.token).toString("base64"))
            } else {
                console.log(redBright("Some unknown error occured"))
            }
        })
    }
}