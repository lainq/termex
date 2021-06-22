import { lookup } from "mime-types";
import { cwd } from "process";
import { File } from "./utils";
import { Walk } from "./walk";

export class ContentPercent {
    private readonly path:string = cwd()
    
    constructor(parameters:Array<string>){
        const files:Array<string> = new Walk(this.path, parameters).files
        const mime = this.mimeTypes(files)
        console.log(mime)
    }

    private mimeTypes = (files:Array<string>):Map<string, Array<string>> => {
        let typeMap:Map<string, Array<string>> = new Map<string, Array<string>>()
        for(let index=0; index<files.length; index++){
            const file:string = files[index]
            const type:string | false = lookup(file)

            const typeString:string = type == false ? "unknown" : type.split("/").slice(1)[0]
            let match:Array<string> | undefined = typeMap.get(typeString)
            if(!match){
                match = []
                typeMap.set(typeString, match)
            }
            match.push(file)
            typeMap.set(typeString, match)
        }       
        return typeMap 
    }

    private lines = (types:Map<string, Array<string>>):any => {
        // const keys:Array<string> = types.
    }
}