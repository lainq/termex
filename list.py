import os
import time

from rich.console import Console
from rich.syntax import Syntax
from rich.table import Table

class ListDirectories(object):
	def __init__(self, path):
		self.path = path
		self.console = Console()

		if self.path.is_directory:
			self.list_directory_content()
		else:
			self.open_file()

	def list_directory_content(self):
		files = os.listdir(self.path.filename)
		table = Table(title=self.path.filename)

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

			table.add_row(filename, file_type, extension, f"{size} bytes", modified_time)
		self.console.print(table)

	def open_file(self):
		"""Show the content of a file in the terminal"""
		with open(self.path.filename, "rt") as file_reader:
			syntax = Syntax(file_reader.read(), self.path.filename.split(".")[-1], line_numbers=True)
			self.console.print(syntax)

