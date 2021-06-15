import { stdin } from "process";
import { emitKeypressEvents } from "readline";

interface Events {
    sequence? : string;
    name? : string,
    ctrl? : boolean,
    meta? : boolean,
    shift? : boolean
}

export class InputMode {
    constructor(listeners:Map<string, Function>) {
        emitKeypressEvents(stdin)
        if (stdin.isTTY) {
            stdin.setRawMode(true);
        }   

        const parsedEvents = this.parseEvents(listeners)
        // this.addEventListeners() 
    }

    private parseEvents = (listeners:Map<string, Function>) => {
        const events:Array<string> = Array.from(listeners.keys())
        let parsedEvents:Array<Events> = new Array<Events>()
        for(let eventKeyIndex=0; eventKeyIndex<events.length; eventKeyIndex++){
            const currentEventArray:Array<string> = events[eventKeyIndex].split("+").map((stringLiteral:string) => {
                return stringLiteral.trim()
            })
            let event:Events = {
                name : currentEventArray.filter((element:string):boolean => {
                    return !["shift", "meta", "ctrl", "+"].includes(element)
                }).join(""),
                ctrl : currentEventArray.includes('ctrl'),
                shift : currentEventArray.includes('shift'),
                meta : currentEventArray.includes('meta')
            }
            parsedEvents.push(event)
        }
        console.log(parsedEvents)
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