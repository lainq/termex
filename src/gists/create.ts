import { Octokit } from '@octokit/core'
import { greenBright, redBright, yellowBright } from 'chalk';
import { readdirSync, readFileSync, statSync } from 'fs';
import inquirer from 'inquirer';
import { join } from 'path';
import { cwd } from 'process';
import { clearPreviousLine } from '../utils';

export class CreateGist {
    private client:Octokit

    constructor(client:Octokit) {
        this.client = client;
        this.collectFiles()
    }

    private collectFiles():void {
        const directoryContent:Array<string> = readdirSync(cwd()).filter((filename:string):boolean => {
            return statSync(join(cwd(), filename)).isFile()
        })
        for(let index=0; index<directoryContent.length; index++){
            const currentFilename:string = directoryContent[index]
            console.log(`${yellowBright((index + 1) + ":")}  ${greenBright(currentFilename)}`)
        }
        inquirer.prompt({
            type: "input",
            message: "Enter the file indexes(seperated by comma)",
            name: "inputFiles"
        }).then((response:{inputFiles:any}):void => {
            const filenames:Array<string> = response.inputFiles.split(",").map((currentFile:string):string => {
                return currentFile.trim()
            })
            const selectedFiles:Array<string> = filenames.map((fileIndex:string):string | undefined => {
                const fileIndexNumber:number = parseInt(fileIndex)
                return directoryContent[fileIndexNumber-1]
            }).filter((value:string | undefined):boolean => {
                return value != undefined
            })
            let fileContent:any = {}
            for(let selectedFileIndex=0; selectedFileIndex<selectedFiles.length; selectedFileIndex++){
                const currentSelectedFile = join(cwd(), selectedFiles[selectedFileIndex])
                fileContent[selectedFiles[selectedFileIndex]] = {content:readFileSync(currentSelectedFile).toString()}
            }
            console.log(yellowBright("Publishing the gist..."))
            this.client.request("POST /gists", { files: fileContent }).then((response:any):void => {
                clearPreviousLine()
                console.log(greenBright("Published"))
            }).catch((error):void => {
                console.log(redBright(error))
            })
        })
    }
}