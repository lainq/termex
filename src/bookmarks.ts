import { mkdir, readFileSync, writeFile, writeFileSync } from "fs";
import { join } from "path";
import { checkFileExists } from './utils'
import { CommandLineException } from './exception'

export class Bookmarks {
    private static readonly dirname:string = join(__dirname, "bookmarks")
    private static readonly path:string = join(Bookmarks.dirname, "bookmarks.json")

    constructor() { this.createBookmarkFiles() }

    public static add = (path:string, time:Date, bookmarks:Bookmarks):void => {
        let paths:any = Array.from(bookmarks.readBookmarksFile())
        let removed:boolean = false

        if(paths.includes(path)){
            paths = paths.filter((currentPath:string) => {return currentPath != path})
            removed = true
        } else {
            paths.push(path)
        }
        bookmarks.writeFile(JSON.stringify(paths))
    }

    private createBookmarkFiles = ():void => {
        if(!checkFileExists(Bookmarks.dirname, true)){
            mkdir(Bookmarks.dirname, (err:NodeJS.ErrnoException | null):void | null=> {
                if(err) { 
                    new CommandLineException({message:err.message}, false)
                    return null
                }
            })
        }
        if(!checkFileExists(Bookmarks.path, false)){
            writeFile(Bookmarks.path, JSON.stringify([]), (err:NodeJS.ErrnoException | null):void | null => {
                if(err){
                    new CommandLineException({message:err.message})
                }
            })
        }
    }

    private readBookmarksFile = ():any => {
        this.createBookmarkFiles()
        const fileContent:string = readFileSync(Bookmarks.path).toString()
        try {
            return JSON.parse(fileContent)
        } catch(exception:any) {
            this.writeFile(JSON.stringify([]))
            return []
        }
    }

    private writeFile = (content:string):void | null => {
        this.createBookmarkFiles()
        writeFile(Bookmarks.path, content, (err:NodeJS.ErrnoException | null):void => {
            if(err) {
                new CommandLineException({message:err.message}, false)
                return null
            }
        })
    }
}