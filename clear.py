from os import system, name


def clear():
    if name == "nt":
        _ = system("cls")
    else:
        _ = system("clear")
