import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { checkFileExists } from "../utils";

export class RichPresenceSettings {
  public static readonly settingsFile: string = join(
    homedir(),
    ".termex",
    ".rpc"
  );

  /**
   * @public
   * @static
   * 
   * Read the settings file and get the client
   * id stored in it
   * 
   * @returns {string | null} The client id
   */
  public static getClientId = (): string | null => {
    if (!checkFileExists(RichPresenceSettings.settingsFile, false)) {
      return null;
    }
    const key: string = readFileSync(RichPresenceSettings.settingsFile)
      .toString()
      .trim();
    return key.length == 0 ? null : key;
  };
}
