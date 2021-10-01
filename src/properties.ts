import boxen from "boxen";
import { cyan, yellowBright } from "chalk";
import { readdirSync, Stats, statSync } from "fs";
import { basename } from "path";
import { checkFileExists, File } from "./utils";

interface FileSize {
  // The size of the file in bytes
  // and megabytes
  bytes: number;
  megaBytes: number;
}

interface FileContent {
  // The number of files and folders that
  // a directory contains
  files: number;
  folders: number;
}

interface FileProperties {
  // The basename of the file
  name: string;
  // The type of the files
  // 'file' for files, 'dir' for directories
  fileType: string;
  // The complete path of the file
  location: string;
  // The size of the file in bytes and
  // megabytes
  size: FileSize;
  // The number of files and folders
  // the directory contains
  content?: FileContent;
  // The time at which the file was created and
  // last modified at
  createdAt: Date;
  modifiedAt: Date;
}

export class Properties {
  private readonly file: File;

  /**
   * @constructor
   * @param {File} file The file object
   */
  constructor(file: File) {
    this.file = file;
    console.clear();
    this.logProperties(this.createFileProperties(this.file.path));
  }

  /**
   * @private
   *
   * Shorten a date object and convert it
   * to a string
   *
   * @param {Date} date The date object to convert
   * @returns {string} The converted string
   */
  private createDateString = (date: Date): string => {
    return date.toString().split(" ").slice(0, 4).join(" ");
  };

  /**
   * @private
   *
   * To print all the properties of the file
   *
   * @param {Properties} properties The properties of the file
   */
  private logProperties = (properties: FileProperties): void => {
    const propertyString: string = yellowBright(
      [
        `Name: ${properties.name}`,
        `Type: ${properties.fileType}`,
        `Location: ${properties.location}`,
        `Size: ${properties.size.bytes} bytes`,
        `\n`,
        properties.content
          ? `${properties.content.folders} Folder(s), ${properties.content.files} File(s)`
          : ``,
        `\n`,
        `Created At: ${this.createDateString(properties.createdAt)}`,
        `Modified At: ${this.createDateString(properties.modifiedAt)}`,
      ].join("\n")
    );
    console.log(
      cyan(
        boxen(propertyString, {
          borderStyle: "double",
          padding: 2,
          margin: 2,
        })
      )
    );
  };

  /**
   * @private
   *
   * Get the properties of a file
   *
   * @param path The path of the file
   * @returns {FileProperties} The properties of the file
   */
  private createFileProperties = (path: string): FileProperties => {
    const stats: Stats = statSync(path);
    // Checks if the path is a directory, if yes.
    // Collect the file content
    const fileContent: Array<string> | undefined = this.file.isDirectory
      ? readdirSync(this.file.path)
      : undefined;
    let properties: FileProperties = {
      name: basename(path),
      fileType: this.file.isDirectory ? "dir" : "file",
      location: path,
      size: { bytes: stats.size, megaBytes: stats.size / (1024 * 1024) },
      createdAt: stats.ctime,
      modifiedAt: stats.mtime,
    };
    // If the file is a directory
    // Fill in the content field in the
    // properties
    if (this.file.isDirectory) {
      const folderLength: number = fileContent.filter(
        (filename: string): boolean => {
          return checkFileExists(filename, true);
        }
      ).length;
      properties.content = {
        files: fileContent.length - folderLength,
        folders: folderLength,
      };
    }
    return properties;
  };
}
