import { readFileSync } from "fs";
import { lookup } from "mime-types";
import { cwd } from "process";
import { File } from "./utils";
import { Walk } from "./walk";

interface Count {
    mimeType:string,
    files:number,
    lines:number
}
export class ContentPercent {
    private readonly path:string = cwd()
    
    constructor(parameters:Array<string>){
        const files:Array<string> = new Walk(this.path, parameters).files
        const mime = this.mimeTypes(files)
        
        const stats:Map<string, Count> = this.createStats(mime)
        console.log(stats)
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

    private createStats = (types:Map<string, Array<string>>):Map<string, Count> => {
        const keys:Array<string> = Array.from(types.keys())
        let data:Map<string, Count> = new Map<string, Count>()
        for(let index=0; index<keys.length; index++){
            let linesOfCode:number = 0
            const element:Array<string> | undefined = types.get(keys[index])
            if(!element){ continue }
            for(let fileIndex=0; fileIndex<element.length; fileIndex++){
                const currentFile:string = element[fileIndex]
                linesOfCode += readFileSync(currentFile).toString().split('\n').length
            }
            const count:Count = {
                mimeType : keys[index],
                files: element.length,
                lines: linesOfCode
            }
            data.set(keys[index], count)
        }
        return data
    }
}