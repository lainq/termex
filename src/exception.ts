import { redBright, yellowBright } from "chalk"

export class CommandLineException {
    private readonly message:string
    private readonly suggestion?:string

    constructor(message:string, suggestion?:string, isFatal:boolean = true, exitStatusCode:number = 1){
        this.message = message
        this.suggestion = suggestion
        this.throw(isFatal, exitStatusCode)
    }

    private throw(isFatal:boolean, exitStatusCode:number) {
        console.log(redBright(this.message))
        if (this.suggestion){
            console.log(yellowBright(this.suggestion))
        }
        if (isFatal){
            process.exit(exitStatusCode)
        }
    }
}