import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { File } from './utils'
import { CommandLineException } from './exception'

export class Gitignore {
    public ignoreFiles = (path:File) => {
        if(!path.isDirectory){
            new CommandLineException({
                message : '--gitignore can only be used with directories'
            })
        }
        const data = this.findGitignore(path.path)
        console.log(data)
    }

    private findGitignore = (path:string):string => {
        if(!readdirSync(path).includes(".gitignore")){
            return ''
        }
        const filepath:string = join(path, ".gitignore")
        try {
            return readFileSync(filepath).toString()
        } catch {
            return ''
        }
    }
}