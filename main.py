import sys
import os

from exception import CommandLineException

class File(object):
    def __init__(self, filename):
        self.filename = filename

    @property
    def exists(self):
        return os.path.exists(self.filename)

    @property
    def is_directory(self):
        return os.path.isdir(self.filename)

    @property 
    def size(self):
        return os.stat(self.filename).st_size


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
    print("LO")

if __name__ == "__main__":
    result = main()
    print(result)