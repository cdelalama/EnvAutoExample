import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
	try {
		context.subscriptions.push(
			vscode.commands.registerCommand("EnvAutoExample.generate", () => {
				vscode.workspace
					.findFiles("**/*.env*")
					.then((files) =>
						files.forEach((file) => {
							if (!file.fsPath.endsWith(".example")) {
								processEnvFile(file.fsPath);
							}
						})
					)
					.then(() =>
						vscode.window.showInformationMessage("Generated .env.example files")
					);
			})
		);

		vscode.workspace.onDidSaveTextDocument((document) => {
			if (
				path.basename(document.fileName).startsWith(".env") &&
				!document.fileName.endsWith(".example")
			) {
				processEnvFile(document.fileName);
			}
		});

		if (vscode.workspace.workspaceFolders) {
			const watcher = vscode.workspace.createFileSystemWatcher("**/*.env*");
			watcher.onDidChange((uri) => {
				if (uri && !uri.fsPath.endsWith(".example")) {
					processEnvFile(uri.fsPath);
				}
			});
			context.subscriptions.push(watcher);
		}
	} catch (err) {
		vscode.window.showErrorMessage(
			err instanceof Error
				? `Error: ${err.message}`
				: "An unknown error occurred"
		);
	}
}

async function processEnvFile(envFilePath: string) {
	const exampleFilePath = envFilePath + ".example";
	if (ignoreFile(envFilePath)) {
		if (fs.existsSync(exampleFilePath)) {
			fs.unlinkSync(exampleFilePath);
			vscode.window.showInformationMessage(".env.example file removed");
		}
	} else {
		await generateEnvExample(envFilePath, exampleFilePath);
		vscode.window.showInformationMessage("Updated .env.example");
	}
}

function ignoreFile(envFilePath: string): boolean {
	const useExampleFlag = vscode.workspace
		.getConfiguration("EnvAutoExample")
		.get("useExampleFlag");
	const firstLine = fs
		.readFileSync(envFilePath, { encoding: "utf-8" })
		.split("\n")[0]
		.trim()
		.toLowerCase();

	// If useExampleFlag is true, ignore the file if it does not have the #example flag.
	// If useExampleFlag is false, ignore the file if it has the #noexample flag.
	return useExampleFlag ? firstLine !== "#example" : firstLine === "#noexample";
}

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateEnvExample(
	envFilePath: string,
	outputFilePath: string
): Promise<void> {
	if (ignoreFile(envFilePath)) {
		if (fs.existsSync(outputFilePath)) {
			fs.unlinkSync(outputFilePath);
			vscode.window.showInformationMessage(".env.example file removed");
		}
		return;
	}

	try {
		if (!fs.existsSync(envFilePath)) {
			throw new Error(`File not found: ${envFilePath}`);
		}

		await delay(500); // wait for 100ms
		const envData = fs.readFileSync(envFilePath, { encoding: "utf-8" });
		const lines = envData.split("\n");
		let outputData = lines.map(processLine).join("\n");
		fs.writeFileSync(outputFilePath, outputData);
		vscode.window.showInformationMessage("Updated .env.example");
	} catch (err) {
		if (err instanceof Error) {
			console.error(`Failed to generate .env.example: ${err.message}`);
		} else {
			console.error(`An unknown error occurred`);
		}
	}
}

function processLine(line: string): string {
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
