import { existsSync, statSync } from "fs"

export interface File {
    path:string
    exists:boolean
    isDirectory:boolean
}

export const checkFileExists = (filename:string, isDirectory:boolean = true):boolean => {
    try {
        const exists:boolean = existsSync(filename)
        if(!isDirectory){
            return exists
        }
        return exists && statSync(filename).isDirectory()
    } catch(exception:any) {
        return false
    }
}