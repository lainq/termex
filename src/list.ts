import { readdirSync, readFile } from "fs"
import { join } from "path"
import { checkFileExists, File } from "./utils"
import { chdir } from 'process'
import { CommandLineException } from './exception'
import { highlight } from 'cli-highlight'

export class ListFiles {
    private path:File
    private files?:Array<string>
    private parameters:Array<string>
    private showTitle:boolean

    private currentFileIndex:number = 0

    constructor(path:File, parameters:Array<string>, showTitle:boolean = true){
        this.path = path
        this.parameters = parameters
        this.showTitle = showTitle
        this.files = this.path.isDirectory ? readdirSync(this.path.path).filter((filename:string) => {
            const onlyDirs:boolean = this.parameters.includes('only-dirs')
            if(onlyDirs){
                return checkFileExists(join(this.path.path, filename), true)
            }
            return true
        }) : undefined

        this.create()
    }

    private create = ():any => {
        if(this.path.isDirectory) {
            try { chdir(this.path.path) }
            catch(excpetion:any) { new CommandLineException({
                message : excpetion.msg
            })}
            console.log("listing dirs")
        } else {
            this.openFile()
        }
    }

    private openFile = () => {
        readFile(this.path.path, (err:NodeJS.ErrnoException | null, data:Buffer) => {
            if(err){
                new CommandLineException({
                    message : err.message
                })
            }
            const dataToString:string = data.toString()
            console.log(highlight(dataToString))
        })
    }
}