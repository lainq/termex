import sys

from rich import print

class CommandLineException(object):
	default_exit_status_code = 1
	default_error_message = "Something unexpected happened"

	def __init__(self, message, suggestion=None, is_fatal=True, exit_status_code=None):
		self.message = message or self.default_error_message
		self.suggestion = suggestion
		self.is_fatal = is_fatal
		self.exit_status_code = exit_status_code or self.default_exit_status_code

		self.evoke_exception()

	def evoke_exception(self):
		print(f"[bold red]Error:{self.message}[/bold red]")
		if self.suggestion:
			print(f"[magenta]{self.suggestion}[/magenta]")
		if self.is_fatal:
			sys.exit(self.exit_status_code)