import { dirname } from "path";
import { cwd } from "process";
import { CommandLineException } from "./exception";
import { ListFiles } from "./list";
import { checkFileExists, File } from "./utils";

export const initializeTermex = (
  filename: string,
  parameters: Array<string>
) => {
  let file: string = filename;
  if (filename === "..") {
    file = dirname(filename);
  } else if (filename == ".") {
    file = cwd();
  }
  const fileObject: File = {
    path: file,
    exists: checkFileExists(filename, false),
    isDirectory: checkFileExists(filename),
  };
  if (!fileObject.exists) {
    new CommandLineException({
      message: `${file} does not exist`,
    });
  }
  const ls = new ListFiles(fileObject, parameters);
};
