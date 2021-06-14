import { readdirSync } from "fs"
import { join } from "path"
import { checkFileExists, File } from "./utils"

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

        console.log(this.files)
    }
}