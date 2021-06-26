import { greenBright, yellowBright } from "chalk";
import { basename, dirname } from "path";
import { clearPreviousLine } from "./utils";
import { Walk } from "./walk";

export class DirectoryFiles {
    private readonly path:string;

    constructor(path:string, parameters) {
        this.path = path
        this.generate(parameters)
    }

    private generateMap = (files:Array<string>) => {
        let generatedMap:Map<string, Array<string>> = new Map<string, Array<string>>()
        for(let index=0; index<files.length; index++){
            const filename:string = files[index]
            let baseDirectory:string = dirname(filename)
            baseDirectory = baseDirectory == this.path ? "." : baseDirectory.slice(this.path.length)
            if(!generatedMap.get(baseDirectory)){
                generatedMap.set(baseDirectory, new Array<string>())
            }
            let directoryFiles:Array<string> = generatedMap.get(baseDirectory)
            directoryFiles.push(basename(filename))
            generatedMap.set(baseDirectory, directoryFiles)
        }
        this.displayTree(generatedMap)
    }

    private displayTree = (generatedMap:Map<string, Array<string>>):void => {
        clearPreviousLine()
        let outputString:string = ""
        const keys:Array<string> = Array.from(generatedMap.keys())
        for(let index=0; index<keys.length; index++){
            const element = generatedMap.get(keys[index])
            outputString += greenBright(keys[index]) + " => " + yellowBright(element.toString()) +"\n"
        }
        console.log(outputString)
    }

    private generate = (parameters:Array<string>):void => {
        const files:Array<string> = new Walk(this.path, parameters).files
        this.generateMap(files)        
    }
}
