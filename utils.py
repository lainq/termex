import os

from rich import print
from pyfiglet import Figlet

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


def print_title():
    text = Figlet().renderText("\tTermex")
    print(text)
