import { bgRedBright } from 'chalk'
import { readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { checkFileExists, File } from './utils'

const GITHUB_TOKEN_PATH:string = join(homedir(), ".termex", ".ggt")

export class GithubGists {
    constructor(file:File) {
        if(!file.isDirectory){
            let apiKey = this.readApiKey()
            apiKey = this.readApiKey()
            console.log(apiKey)
        } else {
            console.log(bgRedBright(`Gist feature only supported with files`))
        }
    }

    private readApiKey = ():string | null => {
        if(!checkFileExists(GITHUB_TOKEN_PATH, false)){
            writeFileSync(GITHUB_TOKEN_PATH, "")
            return null
        }
        return Buffer.from(readFileSync(GITHUB_TOKEN_PATH).toString(), "base64").toString("utf-8")
    }
}