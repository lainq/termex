import sys
import os

from exception import CommandLineException
from list import ListDirectories
from utils import File
from arguments import ArgumentParser


def main():
    parser = ArgumentParser().parse()
    filename = None
    if not parser.command:
        filename = os.getcwd()
    else:
        if parser.command == ".":
            filename = os.getcwd()
        elif parser.command == "..":
            filename = os.path.dirname(os.getcwd())
        else:
            filename = parser.command
    
    file_object = File(filename)
    if not file_object.exists:
        CommandLineException(f"{filename} does not exist")
    _ = ListDirectories(file_object, parameters=parser.parameters).create()


if __name__ == "__main__":
    result = main()
