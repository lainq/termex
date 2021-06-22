import { cyanBright, yellowBright } from "chalk";
import { readFileSync } from "fs";
import { isBinaryFileSync } from "isbinaryfile";
import { lookup } from "mime-types";
import { cwd } from "process";
import { table } from "table";
import { File } from "./utils";
import { Walk } from "./walk";

interface Count {
    mimeType:string,
    files:number,
    lines:number
}
export class ContentPercent {
    private readonly path:string = cwd()
    private files:number = 0
    private lines:number = 0
    
    constructor(parameters:Array<string>){
        const files:Array<string> = new Walk(this.path, parameters).files
        const mime = this.mimeTypes(files)
        
        const stats:Map<string, Count> = this.createStats(mime)
        const percent:Map<string, Count> = this.createPercent(stats)

        this.displayTable(percent)
    }

    private displayTable = (data:Map<string, Count>):void => {
        let tableData:Array<Array<string>> = [[cyanBright("Type"), yellowBright("Files"), yellowBright("Lines")]]
        for(const key of Array.from(data.keys())) {
            const element:Count | undefined = data.get(key)
            if(!element) { continue }
            tableData.push([
                element.mimeType,
                `${element.files}%`,
                `${element.lines}%`
            ])
        }
        console.log(table(tableData))
    }

    private createPercent = (stats:Map<string, Count>):Map<string, Count>=> {
        let percent:Map<string, Count> = stats
        let keys:Array<string> = Array.from(percent.keys())
        for(let index=0; index<keys.length; index++){
            const element:Count | undefined = percent.get(keys[index])
            if(!element) { continue }
            percent.set(keys[index], {
                mimeType : element.mimeType,
                files: parseFloat(((element.files / this.files) * 100).toFixed(1)),
                lines: parseFloat(((element.lines / this.lines) * 100).toFixed(1))
            })
        }
        return percent
    }

    private mimeTypes = (files:Array<string>):Map<string, Array<string>> => {
        let typeMap:Map<string, Array<string>> = new Map<string, Array<string>>()
        for(let index=0; index<files.length; index++){
            const file:string = files[index]
            const type:string | false = lookup(file)

            if(isBinaryFileSync(file)){
                continue
            }

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
                this.files += 1
                linesOfCode += readFileSync(currentFile).toString().split('\n').length
            }
            const count:Count = {
                mimeType : keys[index],
                files: element.length,
                lines: linesOfCode
            }
            data.set(keys[index], count)
            this.lines += linesOfCode
        }

        return data
    }
}