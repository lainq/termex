import curses
from rich import print as rprint
import os


menu = ["[...]", "[Find]", "[Bookmarks]", "[VS Code]", "[Terminal]"]


def print_menu(stdscr, selected_col_idx):
    menu = ["[...]", "[Find]", "[Bookmarks]", "[VS Code]", "[Terminal]"]
    y, x = 0, 0
    for idx, element in enumerate(menu):
        if idx == selected_col_idx:
            stdscr.attron(curses.color_pair(1))
            stdscr.addstr(y, x, element)
            stdscr.attroff(curses.color_pair(1))
        else:
            stdscr.addstr(y, x, element)

        x = x + len(element) + 1


def print_center(stdscr, text):
    stdscr.clear()
    h, w = stdscr.getmaxyx()
    x = w // 2
    y = h // 2
    stdscr.addstr(y, x, text)
    stdscr.refresh()


def main(stdscr):
    curses.curs_set(0)
    curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_WHITE)
    current_col = 0
    rprint(print_menu(stdscr, current_col), "cian")

    while 1:
        key = stdscr.getch()

        if key == curses.KEY_LEFT and current_col > 0:
            current_col -= 1
        elif key == curses.KEY_RIGHT and current_col < len(menu) - 1:
            current_col += 1
        elif key == curses.KEY_ENTER or key in [10, 13]:
            if format(menu[current_col]) == "[...]":
                dir = os.path.normpath(os.getcwd() + os.sep + os.pardir)
            elif format(menu[current_col]) == "[Find]":
                print("Do Something")
            elif format(menu[current_col]) == "[Bookmarks]":
                print("Do Something")
            elif format(menu[current_col]) == "[VS Code]":
                try:
                    os.system("code .")
                except:
                    print("You do not have VS Code downloaded!")
            elif format(menu[current_col]) == "[Terminal]":
                print("Do Something")

        print_menu(stdscr, current_col)


curses.wrapper(main)
