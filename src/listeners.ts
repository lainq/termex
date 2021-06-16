import { greenBright } from "chalk"
import { mkdir, readdirSync } from "fs"
import { join } from "path"
import { cwd } from "process"
import { CommandLineException } from "./exception"
import { Prompt } from "./prompt"
import { checkFileExists } from "./utils"

export class KeyboardEvents {
    private static readonly defaultDirectoryname:string = "Folder"

    public static createNewDirectory = ():void => {
        new Prompt({
            prompt : 'Enter the directory name (Folder)',
            character : '[?]',
            callback : (directoryName:string):void | null => {
                const name:string = KeyboardEvents.findDirectoryName(directoryName)
                const path:string = join(cwd(), name)
                if(checkFileExists(path)) {
                    new CommandLineException({
                        message : `${directoryName} already exists`,
                    }, false)
                    return null
                }
                mkdir(path, (err:NodeJS.ErrnoException | null):void | null => {
                    if(err){
                        new CommandLineException({
                            message : err.message
                        }, false)
                        return null
                    }
                    console.log(greenBright(`Successfully created ${path}`))
                })
            }
        })
    }

    private static findDirectoryName = (directoryName:string):string => {
        if(directoryName.length > 0){
            return directoryName
        }
        const files:Array<string> = readdirSync(cwd()).filter((filename:string):boolean => {
            return filename.startsWith(KeyboardEvents.defaultDirectoryname)
        })
        if(files.length == 0){
            return KeyboardEvents.defaultDirectoryname
        }
        return KeyboardEvents.defaultDirectoryname + (files.length - 1).toString()
    }
}