import os

from rich.panel import Panel
from rich.markdown import Markdown

from prompt import InputPrompt
from bookmarks import Bookmarks
from exception import CommandLineException


class KeyboardEventListeners(object):
    @staticmethod
    def create_new_directory(folder_name="Folder"):
        directory = InputPrompt("Enter folder name (Folder)").create_prompt()
        directory = folder_name if len(directory) == 0 else directory
        name = KeyboardEventListeners.__find_default_folder_name(directory)

        path = os.path.join(os.getcwd(), name)
        if os.path.isdir(path):
            CommandLineException(f"{name} already exists", is_fatal=False)
        else:
            os.mkdir(path)
            rprint(f"[green]Successfully created {path}[/green]")

    @staticmethod
    def create_bookmark():
        folder = os.getcwd()
        bookmark = Bookmarks().bookmark(folder)
        if not bookmark:
            rprint(f"[yellow]Removed {folder} from bookmarks [/yellow]")
        else:
            rprint(f"[yellow]Added {folder} to bookmarks [/yellow]")

    @staticmethod
    def create_new_file():
        filename = InputPrompt("Enter filename").create_prompt()
        if len(filename) == 0:
            CommandLineException(f"Invalid filename", is_fatal=False)
            return None

        path = os.path.join(os.getcwd(), filename)
        if os.path.isfile(path):
            CommandLineException(f"{path} already exists", is_fatal=False)
        else:
            with open(path, "w") as file_writer:
                file_writer.write("\n")
            rprint(f"[green]Successfully created {path} [/green]")

    @staticmethod
    def __find_default_folder_name(folder_name):
        if not folder_name.startswith("Folder"):
            return folder_name

        count = len(
            list(filter(lambda filename: filename.startswith("Folder"), os.listdir()))
        )
        if count == 0:
            return folder_name

        return f"{folder_name}{count}"

    @staticmethod
    def preview_markdown(file, console):
        if file.is_directory:
            CommandLineException(f"{file.filename}is a directory")
            return None
        if not file.filename.endswith(".md"):
            rprint(f"[yellow]{file.filename} is not a markdown file[/yellow]")
            return None

        with open(file.filename, "r") as markdown_reader:
            console.print(Markdown(markdown_reader.read()))

    @staticmethod
    def show_bookmarks():
        bookmarks = "\n".join(Bookmarks().get_data())
        rprint(Panel(bookmarks, title="Bookmarks", expand=False))
