import boxen from "boxen"
import { greenBright } from "chalk"
import { Stats, statSync } from "fs"
import { basename } from "path"

/**
 * Show preview for normal files(files which are not images)
 * and directories
 */
const showFilePreview = (filename:string, stats:Stats, fields?:Map<string, Function>):void => {
    const collectFieldValues = ():Array<string> => {
        if(!fields) return []
        let data:Array<string> = []
        let keys:Array<string> = Array.from(fields.keys())
        for(let index=0; index<keys.length; index++){
            const name:string = keys[index]
            const value:Function = fields.get(name)
            data.push(`${name}: ${value(filename)}`)
        }
        return data
    }
    const base:string = basename(filename)
    let displayString:Array<string> = [
        `Name: ${base}`,
        `Type: Directory`,
        `Created at: ${stats.birthtime.toDateString()}`
    ]
    const extraFieldValues:Array<string> = collectFieldValues()
    if(extraFieldValues.length > 0) {
        displayString = displayString.concat(extraFieldValues)
    }
    console.log(greenBright(boxen(displayString.join("\n"), {padding: 1})));
}

const isImage = (filename:string):boolean => {
    const extensions:Array<string> = ['.png', '.jpg', '.gif', '.jpeg']
    const results:Array<boolean> = extensions.map((value:string):boolean => {
        return filename.endsWith(value)
    })
    return results.includes(true)
}

/**
 * Shows a file prview
 * @param {string} filename The name of the file
 * @returns 
 */
export const previewFiles = (filename:string):void => {
    const stats:Stats = statSync(filename)
    if(stats.isDirectory()){
        showFilePreview(filename, stats)
        return
    } else {
        if(isImage(filename)){
            // TODO: Show image preview
        } else {
            showFilePreview(filename, stats, new Map<string, Function>([
                ['Extension', (filename:string):string => {
                    return filename.split(".").slice(-1)[0]
                }],
                ["Size", (filename:string):string => {
                    return `${stats.size} bytes`
                }]
            ]))
        }
    }
}