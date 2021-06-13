import os
import sys

from exception import CommandLineException


class ArgumentParser(object):
    class _ArgumentParserResults(object):
        def __init__(self, command, parameters):
            self.command = command
            self.parameters = parameters

        def __str__(self):
            return self.__repr__()

        def __repr__(self):
            return f"{self.command}:{self.parameters}"

    arguments = sys.argv[1:]

    def parse(self):
        command, parameters = None, []
        for index, argument in enumerate(self.arguments):
            if index == 0:
                command = argument
                continue
            is_valid_command = argument.startswith("--")
            if not is_valid_command:
                CommandLineException(
                    f"{argument} is not a valid parameter key",
                    "parameters should start with double hiphens",
                )
            parameters.append(argument[2:])
        return self._ArgumentParserResults(command, parameters)
