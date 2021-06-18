import { existsSync, statSync } from "fs";
import { stdout } from "process";
import { clearLine, moveCursor } from "readline";

export const clearPreviousLine = () => {
  moveCursor(stdout, 0, -1)
  clearLine(stdout, 1)
}

export interface File {
  path: string;
  exists: boolean;
  isDirectory: boolean;
}

export const checkFileExists = (
  filename: string,
  isDirectory: boolean = true
): boolean => {
  try {
    const exists: boolean = existsSync(filename);
    if (!isDirectory) {
      return exists;
    }
    return exists && statSync(filename).isDirectory();
  } catch (exception: any) {
    return false;
  }
};
