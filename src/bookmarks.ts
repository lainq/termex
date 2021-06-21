import { mkdir, readFileSync, writeFile, writeFileSync } from "fs";
import { join } from "path";
import { checkFileExists, clearPreviousLine } from "./utils";
import { CommandLineException } from "./exception";
import { cyanBright, yellow, yellowBright } from "chalk";
import boxen from "boxen";
import { homedir } from "os";

export class Bookmarks {
  private static readonly dirname: string = join(homedir(), ".termex", "bookmarks")
  private static readonly path: string = join(
    Bookmarks.dirname,
    "bookmarks.json"
  );

  /**
   * @constructor
   *
   * The constructor for the bookmarks class
   * The function initializes the bookmarks
   */
  constructor() {
    this.createBookmarkFiles();
  }

  /**
   * @public
   * @static
   *
   * Display all the bookmarks if any, else
   * thow a nothing exists message
   *
   * @param {Bookmarks} bookmarks The bookmarks object
   * @returns
   */
  public static displayBookmarks = (bookmarks: Bookmarks, logIndex:number): void | null => {
    const data = Array.from(bookmarks.readBookmarksFile());

    // Check whether the use has saved something
    // in the bookmarks.
    if (data.length == 0) {
      console.log(yellow("No Bookmarks yet!"));
      return null;
    }
    const box: string = boxen(data.join("\n"), {
      padding: 1,
      margin: 1,
      borderStyle: "double",
    });
    if(logIndex > 0){
      clearPreviousLine()
    }
    console.log(cyanBright(box));
  };

  /**
   * @public
   * @static
   *
   * Adds the path to bookmark if it is not present in the bookmarks,
   * if it is present, remove it from the bookmarks. And dispay
   * a message based on the action performed
   *
   * @param {string} path The path to add to the bookmark
   * @param {Date} time The time at which the bookmark was added
   * @param {Bookmarks} bookmarks The bookmarks object with the properties read and write
   */
  public static add = (
    path: string,
    time: Date,
    bookmarks: Bookmarks,
    logIndex:number
  ): void => {
    let paths: any = Array.from(bookmarks.readBookmarksFile());
    let removed: boolean = false;

    if (paths.includes(path)) {
      paths = paths.filter((currentPath: string) => {
        return currentPath != path;
      });
      removed = true;
    } else {
      paths.push(path);
    }
    bookmarks.writeFile(JSON.stringify(paths));
    if(logIndex > 0){
      clearPreviousLine()
    }
    if (removed) {
      console.log(
        yellowBright(`Successfully removed ${path} from the bookmark`)
      );
    } else {
      console.log(yellowBright(`Successfully added ${path} to the bookmark`));
    }
  };

  /**
   * @private
   *
   * Check if the directory and the bookmarks file
   * exists and create the files if they do not exist
   */
  private createBookmarkFiles = (): void => {
    if (!checkFileExists(Bookmarks.dirname, true)) {
      mkdir(
        Bookmarks.dirname,
        (err: NodeJS.ErrnoException | null): void | null => {
          if (err) {
            new CommandLineException({ message: err.message }, false);
            return null;
          }
        }
      );
    }
    if (!checkFileExists(Bookmarks.path, false)) {
      writeFile(
        Bookmarks.path,
        JSON.stringify([]),
        (err: NodeJS.ErrnoException | null): void | null => {
          if (err) {
            new CommandLineException({ message: err.message });
          }
        }
      );
    }
  };

  /**
   * @private
   *
   * Read the bookmarks file and return the content
   * is the file as an array of bookmarks
   *
   * @returns {any} The bookmarks
   */
  private readBookmarksFile = (): any => {
    this.createBookmarkFiles();
    const fileContent: string = readFileSync(Bookmarks.path).toString();
    try {
      return JSON.parse(fileContent);
    } catch (exception: any) {
      this.writeFile(JSON.stringify([]));
      return [];
    }
  };

  /**
   * @private
   *
   * Write some data to the bookmarks file. This is used
   * when the json contains an error and should be reset.
   *
   * @param {string} content The content to write to the file
   */
  private writeFile = (content: string): void | null => {
    this.createBookmarkFiles();
    writeFile(
      Bookmarks.path,
      content,
      (err: NodeJS.ErrnoException | null): void => {
        if (err) {
          new CommandLineException({ message: err.message }, false);
          return null;
        }
      }
    );
  };
}
