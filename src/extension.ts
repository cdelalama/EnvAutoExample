import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
	try {
		context.subscriptions.push(
			vscode.commands.registerCommand("EnvAutoExample.generate", () => {
				const envFile = vscode.workspace.findFiles("**/.env").then((files) => {
					if (files.length > 0) {
						const envFilePath = files[0].fsPath;
						generateEnvExample(
							envFilePath,
							path.join(path.dirname(envFilePath), ".env.example")
						);
						vscode.window.showInformationMessage("Generated .env.example");
					} else {
						vscode.window.showErrorMessage(".env file not found");
					}
				});
			})
		);
		vscode.workspace.onDidSaveTextDocument(async (document) => {
			if (path.basename(document.fileName) === ".env") {
				const envFilePath = document.fileName;

				const exampleFilePath = path.join(
					path.dirname(envFilePath),
					".env.example"
				);

				if (fs.existsSync(envFilePath)) {
					generateEnvExample(envFilePath, exampleFilePath);
					vscode.window.showInformationMessage("Updated .env.example");
				}
			}
		});
		if (vscode.workspace.workspaceFolders) {
			const watcher = vscode.workspace.createFileSystemWatcher("**/.env");
			watcher.onDidChange(async (uri) => {
				const envFilePath = uri.fsPath;
				const exampleFilePath = path.join(
					path.dirname(envFilePath),
					".env.example"
				);

				if (fs.existsSync(envFilePath)) {
					generateEnvExample(envFilePath, exampleFilePath);
					vscode.window.showInformationMessage("Updated .env.example");
				}
			});
			context.subscriptions.push(watcher);
		}
	} catch (err) {
		if (err instanceof Error) {
			vscode.window.showErrorMessage(`Error: ${err.message}`);
		} else {
			vscode.window.showErrorMessage(`An unknown error occurred`);
		}
	}

	function generateEnvExample(envFilePath: string, outputFilePath: string): void {
		try {
			if (!fs.existsSync(envFilePath)) {
				throw new Error(`File not found: ${envFilePath}`);
			}

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
					comment = ` #${comment}`;  // add space and # back to the start of comment
				}

				// Proceed as before, but append the comment to the output if it exists.
				let newValue = `your-${key.toLowerCase()}`;
				if (value.trim().startsWith("\"") && value.trim().endsWith("\"")) {
					newValue = `"${newValue}"`;
				}

				outputData += `${key}=${newValue.trim()}${comment}\n`;
			}

			fs.writeFileSync(outputFilePath, outputData);
		} catch (err) {
			if (err instanceof Error) {
				console.error(`Failed to generate .env.example: ${err.message}`);
			} else {
				console.error(`An unknown error occurred`);
			}
		}
	}


}