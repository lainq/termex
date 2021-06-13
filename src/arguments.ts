import { argv } from "process";
import { CommandLineException } from "./exception";

export interface ArgumentParserResults {
    command:string,
    parameters:Array<string>
}

export class ArgumentParser {
    private readonly arguments:Array<string> = argv.slice(2)

    public parseArguments():ArgumentParserResults {
        let command:string = 'help'
        let parameters:Array<string> = new Array<string>()
        for(let index=0; index<this.arguments.length; index++){
            const currentArgument:string = this.arguments[index]
            if (index == 0){
                command = currentArgument
                continue
            }
            const isValidArgument:boolean = currentArgument.startsWith("--")
            if(!isValidArgument){
                const error = new CommandLineException({
                    message : `${currentArgument} is not a valid argument`,
                    suggestion : "Parameter keys should start with --"
                })
            }
            parameters.push(currentArgument)
        }
        return {command:command, parameters:parameters}
    }
}