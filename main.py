import sys
import os

from exception import CommandLineException
from list import ListDirectories
from utils import File


def main():
    arguments = sys.argv[1:]
    filename = None
    if len(arguments) == 0:
        filename = os.getcwd()
    else:
        filename = arguments[0]
        if filename == ".":
            filename = os.getcwd()
        elif filename == "..":
            filename = os.path.dirname(os.getcwd())

    file_object = File(filename)
    if not file_object.exists:
        CommandLineException(f"{filename} does not exist")
    _ = ListDirectories(file_object).create()


if __name__ == "__main__":
    result = main()
