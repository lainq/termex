import { yellowBright } from "chalk";
import { mkdir } from "fs";
import { homedir } from "os";
import { join } from "path";
import { checkFileExists } from "./utils";

export class SetupTermex {
    private static readonly home:string = homedir()
    private static readonly dirName:string = join(SetupTermex.home, ".termex")

    /**
     * @public
     * @static
     * 
     * Create directories in the home dir
     * where all important settings are stored
     */
    public static createSetup = () => {
        if(!checkFileExists(SetupTermex.dirName, true)){
            mkdir(SetupTermex.dirName, (error:NodeJS.ErrnoException | null):any => {
                if(error){
                    console.log(yellowBright(`Failed to create ${SetupTermex.dirName}`))
                    console.log(yellowBright(`Please manually create ${SetupTermex.dirName}`))
                }
            })
        }
    }
}