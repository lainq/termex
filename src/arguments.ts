import { argv } from "process";

export class ArgumentParser {
    private readonly arguments:Array<string> = argv.slice(2)

    public parse() {
        let command:string = 'help'
        let parameters:Array<string> = new Array<string>()
        for(let index=0; index<this.arguments.length; index++){
            const currentArgument:string = this.arguments[index]
            if (index == 0){
                command = currentArgument
                continue
            }
            const isValidArgument:boolean = currentArgument.startsWith("--")
            
        }
    }
}