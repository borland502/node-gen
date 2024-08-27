#!/usr/bin/env -S npx tsx

import { $, chalk, which, question, LogEntry, ProcessOutput } from "zx";
import { exit } from "process";
import { ChalkInstance } from "chalk";

const LogLevel: Record<string, ChalkInstance> = {
	debug: chalk.hex("#5ad4e6"),
	info: chalk.hex("#948ae3"),
	warn: chalk.hex("#fd9353"),
	error: chalk.hex("#fc618d"),
};

const log = (msg: string, level: ChalkInstance) => console.log(level(msg));

$.shell = "/bin/zsh";
$.log = (entry: LogEntry) => {
	switch (entry.kind) {
		case "stdout":
			log(entry.data.toString(), LogLevel.info);
			break;
		case "stderr":
			log(entry.data.toString(), LogLevel.error);
			break;
	}
};

// Check for all essential commands though npm & friends should be there
const dependencies = ["task", "gum", "curl"];

let program;
let counter: number = 0;

const brew = await which("brew", { nothrow: true });

if (brew == null) {
	log(
		"Brew is the only supported package manager.  Please install the program manually",
		LogLevel.error
	);
	exit(1);
}

// which and zx doesn't work with scripts like nvm, so
const res: ProcessOutput = await $`test -d ~/.nvm || brew install nvm`;
if (res.exitCode !== 0) {
	log("Could not install environment manager nvm", LogLevel.console.error());
}

for (program of dependencies) {
	if ((await which(program, { nothrow: true })) == null) {
		log(`${program} not detected`, LogLevel.warn);
		const res = await question("Would you like to install it?  ", {
			choices: ["Y", "N"],
		});

		if (res == "Y") {
			const res = await $`brew install ${program}`;
			if (res.exitCode == 0) {
				++counter;
			}
		}
	} else {
		++counter;
	}
}

// signal to task or other calling program if all dependencies are satisfied
if (counter == dependencies.length) {
	exit(0);
} else {
	exit(1);
}
