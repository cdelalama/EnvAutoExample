import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
	try {
		context.subscriptions.push(
			vscode.commands.registerCommand("EnvAutoExample.generate", () => {
				const envFile = vscode.workspace
					.findFiles("**/*.env*")
					.then((files) => {
						files.forEach((file) => {
							if (!file.fsPath.endsWith(".example")) {
								const envFilePath = file.fsPath;
								const exampleFilePath = envFilePath + ".example";
								if (ignoreFile(envFilePath)) {
									if (fs.existsSync(exampleFilePath)) {
										fs.unlinkSync(exampleFilePath);
										vscode.window.showInformationMessage(
											".env.example file removed"
										);
									}
								} else {
									generateEnvExample(envFilePath, exampleFilePath);
								}
							}
						});
						vscode.window.showInformationMessage(
							"Generated .env.example files"
						);
					});
			})
		);

		vscode.workspace.onDidSaveTextDocument(async (document) => {
			if (
				path.basename(document.fileName).startsWith(".env") &&
				!document.fileName.endsWith(".example")
			) {
				const envFilePath = document.fileName;
				const exampleFilePath = envFilePath + ".example";

				if (fs.existsSync(envFilePath)) {
					if (ignoreFile(envFilePath)) {
						if (fs.existsSync(exampleFilePath)) {
							fs.unlinkSync(exampleFilePath);
							vscode.window.showInformationMessage(".env.example file removed");
						}
					} else {
						generateEnvExample(envFilePath, exampleFilePath);
						vscode.window.showInformationMessage("Updated .env.example");
					}
				}
			}
		});

		if (vscode.workspace.workspaceFolders) {
			const watcher = vscode.workspace.createFileSystemWatcher("**/*.env*");
			watcher.onDidChange((uri) => {
				if (!uri) {
					console.error("Undefined file change event");
					return;
				}
				if (!uri.fsPath.endsWith(".example")) {
					const envFilePath = uri.fsPath;
					const exampleFilePath = envFilePath + ".example";

					if (fs.existsSync(envFilePath)) {
						if (ignoreFile(envFilePath)) {
							if (fs.existsSync(exampleFilePath)) {
								fs.unlinkSync(exampleFilePath);
								vscode.window.showInformationMessage(
									".env.example file removed"
								);
							}
						} else {
							generateEnvExample(envFilePath, exampleFilePath);
							vscode.window.showInformationMessage("Updated .env.example");
						}
					}
				}
			});
			context.subscriptions.push(watcher);
		}
	} catch (err) {
		if (err instanceof Error) {
			vscode.window.showErrorMessage(`Error: ${err.message}`);
		} else {
			vscode.window.showErrorMessage("An unknown error occurred");
		}
	}
}

function ignoreFile(envFilePath: string): boolean {
	const firstLine = fs
		.readFileSync(envFilePath, { encoding: "utf-8" })
		.split("\n")[0];
	return firstLine.trim().toLowerCase() === "#noexample";
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

		let outputData = "";
		for (const line of lines) {
			// Trim and split each line at the equals sign.
			let [key, remaining] = line.trim().split("=", 2);

			// If there's no remaining part, just output the line as is.
			if (remaining === undefined) {
				outputData += line + "\n";
				continue;
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

			outputData += `${key}=${newValue.trim()}${comment}\n`;
		}

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
