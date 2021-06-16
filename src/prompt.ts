import { stdin, stdout } from "process";
import { createInterface, Interface } from "readline";

interface PromptOptions {
    prompt:string
    character:string
    callback?:Function
    options?:Array<string>
    repeat?:boolean
}

export class Prompt {
    private readonly promptQuery:string;
    private readonly queryCharacter:string;
    private callback?:Function
    private options?:Array<string>

    private readlineInterface:Interface = createInterface({
        input : stdin,
        output : stdout
    })

    constructor(options:PromptOptions){
        this.promptQuery = options.prompt
        this.queryCharacter = options.character
        this.callback = options.callback
        this.options = options.options

        this.createPrompt()
    }

    private createPrompt = ():void => {
        this.readlineInterface.question(this.createPromptString(), (answer:string):void => {
            if(this.callback){
                this.callback(answer)
            }
            this.readlineInterface.close()
        })
    }

    private createPromptString = ():string => {
        let prompt:string = `${this.promptQuery} ${this.queryCharacter}`
        let optionString:string = '';
        if(this.options){
            for(let index=0; index<this.options.length; index++){
                optionString += `${this.options[index]}, `
            }
        }
        prompt = optionString.trim().length == 0 ? prompt : `${prompt}[${optionString}]`
        return `${prompt} `
    }
}