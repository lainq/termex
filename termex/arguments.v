module main

import os { args }

struct ArgumentParserResults {
	command string
	parameters map[string]string
}

struct ArgumentParser {
	arguments []string = args[1..]
}

fn (parser ArgumentParser) parse() ArgumentParser {
	mut command := 'help'
	mut parameters := map[string]string{}
	mut argument_index := 0

	for argument in parser.arguments {
		if argument_index == 0 {
			command = argument
			continue
		}
		is_valid_command := argument.starts_with("--")
	}
}