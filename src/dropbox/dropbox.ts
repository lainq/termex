import { writeFileSync } from "fs";
import { DropBoxSetup } from "./setup";

export class DropboxFiles {
    private setup:DropBoxSetup = new DropBoxSetup()
    private token:string;

    constructor(parameters:Array<string>) {
        this.token = this.setup.getAccessToken()
        console.log(this.token)

        const command:string | undefined = parameters[0]
        if(command == "reset") {
            writeFileSync(this.setup.filepath, "")
        }
    }
}