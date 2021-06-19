import { basename, join } from "path";
import { File } from "./utils";

export class EnvironmentVariables {
    private readonly files:Array<string>
    private readonly path:string

    constructor(files:Array<string>, path:string){
        this.files = files;
        this.path = path

        const env:Array<string> = this.findEnvFiles()
        console.log(env)
    }

    private findEnvFiles = ():Array<string> => {
        return this.files.filter((filename:string):boolean => {
            return filename == ".env"
        }).map((currentFilename:string):string => {
            return join(this.path, currentFilename)
        })
    }

    public static create(file:File):null | void {
        if(!file.isDirectory){
            console.log("NO")
            return null
        }
        console.log("yes")
    }
}