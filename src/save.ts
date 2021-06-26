import { homedir } from "os";
import { join } from "path";

export class SaveFiles {
    private savedFilesDirectory:string = join(homedir(), ".termex", ".saved")
}