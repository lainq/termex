import sys
import os


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


def capture_filename(arguments):
    current_directory = os.getcwd()
    if len(arguments) == 0:
        return current_directory

    filename = arguments[0]
    if filename == ".":
        return current_directory
    elif filename == "..":
        return os.path.dirname(current_directory)


filename = capture_filename(sys.argv[1:])
file = File(filename)
print(filename)
