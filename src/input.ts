import { stdin } from "process";
import { emitKeypressEvents } from "readline";

export class InputMode {
    constructor() {
        emitKeypressEvents(stdin)
        if (stdin.isTTY) {
            stdin.setRawMode(true);
        }   
        this.addEventListeners() 
    }

    private addEventListeners = () => {
        stdin.on('keypress', (chunk, event):void  | null => {
            console.log(event)
            if(!event){
                return null
            }
            if(event.name == 'q' || event.name == 'escape'){
                process.exit()
            }
        })
    }
}