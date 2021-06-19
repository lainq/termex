import { cyan } from "chalk"
import { ArgumentParserResults } from "./arguments"
import { CommandLineException } from "./exception"
import { Prompt } from "./prompt"

const commands:Map<string, Function> = new Map<string, Function>([
    ['env', () => {}]
])

interface ParseResults extends ArgumentParserResults {
}

class ParseCommands {
    private command:string

    constructor(command:string){
        this.command = command
        
        const results:ParseResults = this.createCommand()
        this.executeCommands(results)
    }

    private executeCommands = (results:ParseResults):void | null => {
        const command = results.command
        if(command.length == 0){
            return null
        }
        if(!Array.from(commands.keys()).includes(command)){
            new CommandLineException({
                message : `${command} is not a valid command`
            }, false)
            return null
        }
        const executeFunction:Function = commands.get(command)
        if(executeFunction){
            executeFunction(results.parameters)
        }
    }

    private createCommand = ():ParseResults => {
        const split:Array<string> = this.command.split(" ")
        let command = ''
        let parameters:Array<string> = new Array<string>()
        for(let index=0; index<split.length; index++){
            if(index == 0){
                command = split[index]
                continue
            }
            parameters.push(split[index])
        }
        return {command:command, parameters:parameters}
    }
}

export const command = ():void => {
    new Prompt({
        prompt : '',
        character : '[?]',
        callback : (userInput:string):void => {
            new ParseCommands(userInput)
        }
    })
}