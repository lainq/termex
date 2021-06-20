"use strict";
exports.__esModule = true;
var figlet_1 = require("figlet");
var path_1 = require("path");
var process_1 = require("process");
var arguments_1 = require("./src/arguments");
var exception_1 = require("./src/exception");
var list_1 = require("./src/list");
var utils_1 = require("./src/utils");
var createTitle = function (titleString) {
    if (titleString === void 0) { titleString = "Termex"; }
    figlet_1.text("Termex", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true
    }, function (error, result) {
        if (error) {
            return null;
        }
        console.log(result);
    });
};
var initializeTermex = function (filename, parameters) {
    var file = filename;
    if (filename === "..") {
        file = path_1.dirname(filename);
    }
    else if (filename == ".") {
        file = process_1.cwd();
    }
    var fileObject = {
        path: file,
        exists: utils_1.checkFileExists(filename, false),
        isDirectory: utils_1.checkFileExists(filename)
    };
    if (!fileObject.exists) {
        new exception_1.CommandLineException({
            message: file + " does not exist"
        });
    }
    var ls = new list_1.ListFiles(fileObject, parameters);
};
var performCommand = function (result) {
    var command = result.command;
    if (!command) {
        return function () {
            initializeTermex(process_1.cwd(), result.parameters);
        };
    }
    if (command == "help") {
        return function () {
            console.log("Showing help");
        };
    }
    return function () {
        initializeTermex(command, result.parameters);
    };
};
var argumentParser = new arguments_1.ArgumentParser().parseArguments();
var execute = performCommand(argumentParser);
var executeResults = execute();
