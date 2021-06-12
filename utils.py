from rich import print
from pyfiglet import Figlet

def print_title():
    text = Figlet().renderText("\tTermex")
    print(text)
