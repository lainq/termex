import { existsSync, readFileSync, writeFileSync } from "fs"
import { homedir } from "os"
import { join } from "path"

export interface TermexSettings {
    // Update information
    getBetaUpdates:boolean,
    autoUpdateTermex:boolean
}

const defaultSettings:TermexSettings = {
    getBetaUpdates: false,
    autoUpdateTermex: true
}

/**
 * Get the user preferences
 */
export const getTermexSettings = ():TermexSettings => {
    const filename:string = join(homedir(), ".termex", ".settings")
    if(!existsSync(filename)){
        writeFileSync(filename, Buffer.from(JSON.stringify(defaultSettings), "utf8").toString("base64"))
        return defaultSettings
    }
    const settings:TermexSettings = JSON.parse(Buffer.from(readFileSync(filename).toString(), "base64").toString("utf8"))
    return settings
}


export const getUserPreference = (fields:Array<string>):Map<string, any> => {
    if(fields.length == 0) return;
    const settings:TermexSettings = getTermexSettings()
    const keys:string[] = Array.from(Object.keys(settings))
    let returnValues:Map<string, any> = new Map<string, any>()
    for(let index=0; index<fields.length; index++){
        const currentField:string = fields[index]
        if(keys.includes(currentField)){
            returnValues.set(currentField, settings[currentField])
        }
    }
    return returnValues
}
