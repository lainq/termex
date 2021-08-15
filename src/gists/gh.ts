import { redBright } from "chalk";
import {  exists, existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import { homedir } from "os";
import { join } from "path";
import { Octokit } from "@octokit/core";

export class Github {
    private readonly filepath:string = join(homedir(), ".termex", ".gh_gists_tokens")

    constructor() {
        if(!existsSync(this.filepath)) {
            writeFileSync(this.filepath, "")
        }
    }
    public reset = ():void => {
        rmSync(this.filepath)
        this.makePersonalAccessToken()
    }

    public authenticate = async (client:Octokit):Promise<any> => {
        const { data } = await client.request("/user")
        return data
    }

    public getPersonalAccessToken = ():string => {
        let token = Buffer.from(readFileSync(this.filepath).toString(), "base64").toString("utf8").trim()
        if(token.length == 0) { this.makePersonalAccessToken() }
        token = Buffer.from(readFileSync(this.filepath).toString(), "base64").toString("utf8") 
        return token
    }

    public makePersonalAccessToken = ():void => {
        inquirer.prompt({type:"input", message:"Personal access token", name:"token"}).then((response:{token:any}):void => {
            const accessToken:string = response.token.trim()
            if(accessToken.length == 0) { console.log(redBright("Invalid access token")); process.exit() }
            writeFileSync(this.filepath, Buffer.from(accessToken, "utf8").toString("base64"))
        })
    }
}