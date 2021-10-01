import boxen from "boxen";
import { greenBright, redBright, yellowBright } from "chalk";
import { mkdir, readdirSync, readFile, statSync, writeFile } from "fs";
import marked from "marked";
import TerminalRenderer from "marked-terminal";
import { join } from "path";
import { cwd } from "process";
import { CommandLineException } from "./exception";
import { Prompt } from "./prompt";
import { checkFileExists, File } from "./utils";

export class KeyboardEvents {
  private static readonly defaultDirectoryname: string = "Folder";

  /**
   * @public
   * @static
   *
   * Prompts the user for a folder name and
   * create a directory, throw error if an
   * error occurs
   *
   * @returns {void}
   */
  public static createNewDirectory = (): void => {
    // Create a new prompt
    new Prompt({
      prompt: "Enter the directory name (Folder)",
      character: "[?]",
      callback: (directoryName: string): void | null => {
        const name: string = KeyboardEvents.findDirectoryName(directoryName);
        const path: string = join(cwd(), name);

        // Check if the file exists, if it exists
        // throw an error
        if (checkFileExists(path)) {
          new CommandLineException(
            {
              message: `${directoryName} already exists`,
            },
            false
          );
          return null;
        }
        mkdir(path, (err: NodeJS.ErrnoException | null): void | null => {
          if (err) {
            new CommandLineException(
              {
                message: err.message,
              },
              false
            );
            return null;
          }
          console.log(greenBright(`Successfully created ${path}`));
        });
      },
    });
  };

  /**
   * @private
   * @static
   *
   * Find a name for the new directory
   * If the input is empty, generate a directory name that
   * starts with the keyword "Folder"
   *
   * @param {string} directoryName The current directory name
   * @returns {string} The new directory name
   */
  private static findDirectoryName = (directoryName: string): string => {
    if (directoryName.length > 0) {
      return directoryName;
    }

    // Checks for files in the directory that starts
    // with the keyword "Folder"
    const files: Array<string> = readdirSync(cwd()).filter(
      (filename: string): boolean => {
        return filename.startsWith(KeyboardEvents.defaultDirectoryname);
      }
    );
    if (files.length == 0) {
      return KeyboardEvents.defaultDirectoryname;
    }
    return KeyboardEvents.defaultDirectoryname + (files.length - 1).toString();
  };

  /**
   * @public
   * @static
   *
   * Preview markdown files
   *
   * @param {string} filename The file to preview
   * @returns
   */
  public static previewMarkdown = (filename: string): any => {
    marked.setOptions({ renderer: new TerminalRenderer() });
    if (!checkFileExists(filename, false)) {
      if (!statSync(filename).isFile()) {
        new CommandLineException(
          { message: "This is not a markdown file" },
          false
        );
        return null;
      }
    }

    if (!filename.endsWith(".md")) {
      console.log(yellowBright("Markdown files should have a .md extension"));
      return null;
    }

    readFile(
      filename,
      (err: NodeJS.ErrnoException | null, data: Buffer): any => {
        if (err) {
          new CommandLineException({ message: err.message }, false);
          return null;
        }
        console.log(
          boxen(marked(data.toString()), {
            padding: 1,
            margin: 1,
            borderStyle: "double",
          })
        );
      }
    );
  };

  public static createFile = (file: File, reloadFunction: Function): void => {
    new Prompt({
      prompt: "Enter the filename",
      character: "[?]",
      callback: (filename: string): any => {
        if (!file.isDirectory) {
          console.log(
            yellowBright(
              "You have to be inside of a directory to perform this action"
            )
          );
          return null;
        }
        const path: string = join(file.path, filename);
        const exists: boolean = checkFileExists(path, false);
        if (exists) {
          console.log(redBright(`${filename} already exists`));
          return null;
        }
        writeFile(
          path,
          " ",
          (error: NodeJS.ErrnoException | null): null | void => {
            if (error) {
              new CommandLineException(
                {
                  message: error.toString(),
                },
                false
              );
              return null;
            }
            // console.clear()
            // reloadFunction()
            // console.log(yellowBright(`Succesfully created ${path}`))
          }
        );
        console.clear();
        reloadFunction();
      },
    });
  };
}
