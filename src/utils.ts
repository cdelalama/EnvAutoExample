import * as fs from "fs";
import * as vscode from "vscode";

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ignoreFile(envFilePath: string): boolean {
	const useExampleFlag = vscode.workspace
		.getConfiguration("EnvAutoExample")
		.get("Only Generate From Marked Files");
	const firstLine = fs
		.readFileSync(envFilePath, { encoding: "utf-8" })
		.split("\n")[0]
		.trim()
		.toLowerCase();

	// If useExampleFlag is true, ignore the file if it does not have the #example flag.
	// If useExampleFlag is false, ignore the file if it has the #noexample flag.
	return useExampleFlag ? firstLine !== "#example" : firstLine === "#noexample";
}

export function processLine(line: string): string {
	// Trim and split each line at the equals sign.
	let [key, remaining] = line.trim().split("=", 2);

	// If there's no remaining part, just return the line as is.
	if (remaining === undefined) {
		return line;
	}

	// If there's a # in the line, split again at the # to separate the value and the comment.
	let value = remaining;
	let comment = "";
	if (remaining.includes("#")) {
		[value, comment] = remaining.split("#", 2);
		comment = ` #${comment}`; // add space and # back to the start of comment
	}

	// Proceed as before, but append the comment to the output if it exists.
	let newKey = key.split(".")[0];
	let newValue = `your-${newKey.toLowerCase()}`;
	if (value.trim().startsWith('"') && value.trim().endsWith('"')) {
		newValue = `"${newValue}"`;
	}

	return `${key}=${newValue.trim()}${comment}`;
}
