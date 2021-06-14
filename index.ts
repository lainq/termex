import { dirname } from "path";
import { cwd } from "process";
import { ArgumentParser, ArgumentParserResults } from "./src/arguments";
import { CommandLineException } from "./src/exception";
import { checkFileExists, File } from "./src/utils";

const initializeTermex = (filename:string) => {
    let file:string = filename;
    if(filename === '..') {
        file = dirname(filename)
    } else if(filename == '.'){
        file = cwd()
    }
    const fileObject:File = {
        path: file,
        exists : checkFileExists(filename, false),
        isDirectory : checkFileExists(filename)
    }
    if(!fileObject.exists){
        new CommandLineException({
            message : `${file} does not exist` 
        })
    }
    console.log(fileObject)
}

const performCommand = (result:ArgumentParserResults):Function => {
    const command = result.command
    if(!command){
        return ():void => {initializeTermex(cwd())}
    } 
    if (command == 'help') {
        return ():void => {console.log("Showing help")}
    } 
    return ():void => {initializeTermex(command)}
}

const argumentParser:ArgumentParserResults = new ArgumentParser().parseArguments()
const execute:Function = performCommand(argumentParser)

const executeResults:any = execute()