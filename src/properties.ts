import boxen from "boxen";
import { Chalk, cyan, yellowBright } from "chalk";
import { readdirSync, Stats, statSync } from "fs";
import { basename } from "path";
import { checkFileExists, File } from "./utils";

interface FileSize {
    bytes: number,
    megaBytes: number
}

interface FileContent {
    files: number,
    folders: number
}

interface FileProperties {
    name: string,
    fileType: string,
    location: string,
    size:FileSize,
    content?: FileContent,
    createdAt: Date,
    modifiedAt: Date,
}

export class Properties {
    private readonly file:File;

    constructor(file:File) {
        this.file = file;
        console.clear()
        this.logProperties(this.createFileProperties(this.file.path))
    }

    private createDateString = (date:Date):string => {
        return date.toString().split(" ").slice(0, 4).join(" ")
    }

    private logProperties = (properties:FileProperties):void => {
        const propertyString:string = yellowBright([
            `Name: ${properties.name}`,
            `Type: ${properties.fileType}`,
            `Location: ${properties.location}`,
            `Size: ${properties.size.bytes} bytes`,
            `\n`,
            properties.content ? `${properties.content.folders} Folder(s), ${properties.content.files} File(s)` : ``,
            `\n`,
            `Created At: ${this.createDateString(properties.createdAt)}`,
            `Modified At: ${this.createDateString(properties.modifiedAt)}`
        ].join('\n'))
        console.log(cyan(boxen(propertyString, {
            borderStyle : "double",
            padding : 2,
            margin : 2
        })))
    }

    private createFileProperties = (path:string):FileProperties => {
        const stats:Stats = statSync(path)
        const fileContent:Array<string> | undefined = this.file.isDirectory ? readdirSync(this.file.path) : undefined
        let properties:FileProperties = {
            name : basename(path),
            fileType : this.file.isDirectory ? "dir" : "file",
            location: path,
            size: {bytes:stats.size, megaBytes:stats.size / (1024*1024)},
            createdAt: stats.ctime,
            modifiedAt: stats.mtime
        }
        if(this.file.isDirectory){
            const folderLength:number = fileContent.filter((filename:string):boolean => {
                return checkFileExists(filename, true)
            }).length
            properties.content = {
                files: fileContent.length - folderLength,
                folders: folderLength
            }
        }
        return properties
    }

}