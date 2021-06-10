import os
import time
import getpass
import keyboard

from rich.console import Console
from rich.syntax import Syntax
from rich.table import Table
from rich.text import Text

from exception import CommandLineException
from title import print_title
from listeners import KeyboardEventListeners


class InputMode(object):
    def __init__(self, event_listeners={}):
        self.event_listeners = event_listeners

        self.create_prompt()

    def create_prompt(self):
        # keyboard.add_hotkey('a', lambda: print("LOL"))
        # keyboard.add_hotkey('ctrl + shift + a', print, args =('you entered', 'hotkey'))
        self.add_keyboard_hotkeys(self.event_listeners)

        keyboard.wait("esc")

    def add_keyboard_hotkeys(self, event_listeners):
        assert isinstance(event_listeners, dict)
        for event_listeners_key in event_listeners:
            event_actions = event_listeners[event_listeners_key]

            keyboard.add_hotkey(event_listeners_key.strip(), event_actions)


class ListDirectories(object):
    def __init__(self, path):
        self.path = path
        self.console = Console()

        if self.path.is_directory:
            os.chdir(self.path.filename)
            try:
                self.list_directory_content()
            except Exception as exception:
                CommandLineException(exception.__str__())
        else:
            self.open_file()

    def list_directory_content(self):
        files = os.listdir(self.path.filename)
        directory = self.path.filename
        directory = directory[1:]
        directory = Text(directory, style="bold")
        table = Table(title=directory)

        table.add_column("Name", justify="center", style="cyan", no_wrap=True)
        table.add_column("Type", style="magenta")
        table.add_column("Extension", justify="center", style="green")
        table.add_column("Size", justify="center", style="yellow")
        table.add_column("Modified at", justify="center", style="green")

        for filename in files:
            path = os.path.join(self.path.filename, filename)
            file_type = "dir" if os.path.isdir(path) else "file"
            extension = "N/A" if os.path.isdir(path) else filename.split(".")[-1]
            size = os.stat(path).st_size
            modified_time = time.ctime(os.path.getmtime(path))

            table.add_row(
                filename, file_type, extension, f"{size} bytes", modified_time
            )

        title = print_title()
        print(title)
        console = Console()
        self.console.print(table)
        fileno = Text("| File 1 of 1", style="bold blue")
        user = Text(getpass.getuser().rjust(28, " "), style="bold blue")
        helpinstructions = Text("h=Help |".rjust(38, " "), style="bold blue")
        console.print(fileno + user + helpinstructions)

        self.input_mode()

    def input_mode(self):
        input_mode = InputMode(
            {
                "ctrl + shift + n": KeyboardEventListeners.create_new_directory,
                "ctrl + shift + b": KeyboardEventListeners.create_bookmark,
                "ctrl + b": KeyboardEventListeners.show_bookmarks,
                "ctrl + n": KeyboardEventListeners.create_new_file,
                "ctrl + shift + v": lambda: KeyboardEventListeners.preview_markdown(
                    self.path, self.console
                ),
            }
        )

    def open_file(self):
        """Show the content of a file in the terminal"""
        os.chdir(os.path.dirname(self.path.filename))
        with open(self.path.filename, "rt") as file_reader:
            syntax = Syntax(
                file_reader.read(), self.path.filename.split(".")[-1], line_numbers=True
            )
            self.console.print(syntax)
        self.input_mode()
