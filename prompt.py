from rich import print

from exception import CommandLineException


class InputPrompt(object):
    default_query_character = "[?]"

    def __init__(self, message, character=None):
        self.message = message
        self.character = character or self.default_query_character

    def create_prompt(self):
        print(f"[cyan]{self.message} {self.character}[/cyan]", end="")
        try:
            user_input = input()
            return user_input
        except KeyboardInterrupt as keyboard_interrupt:
            CommandLineException(keyboard_interrupt.__str__())
