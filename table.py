import os
from rich.console import Console
from rich.table import Table
import pathlib
import time
from main import giveout

table = Table(title="Expoterm", style="green")
table.add_column("Name", justify="right", style="cyan", no_wrap=True)
table.add_column("Type", style="yellow")
table.add_column("Extension", style="magenta")
table.add_column("Size(kb)", style="yellow")
table.add_column("Modified", justify="right", style="magenta")

path = giveout()
dir_list = os.listdir(path)
length = len(dir_list)
x = 0
while x < length:
    console = Console()
    name = dir_list[x]
    size = os.path.getsize(name)
    stats = os.stat(name)
    typeno = stats.st_mode
    if typeno == 16877:
        type = "Folder"
        extension = " N/A"
    elif typeno == 33188:
        type = "File"
        extension = pathlib.Path(name).suffix
        if name == ".gitignore":
            extension = name
    modification = time.ctime(os.path.getmtime(name))

    table.add_row(str(name), type, extension, str(size), str(modification))
    x = x + 1


console.print(table)
