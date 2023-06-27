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
				const [key, value] = line.trim().split("=", 2);
				if (value !== undefined) {
					let newValue = `your-${key.toLowerCase()}`;
					// Add quotes if original value had quotes.
					if (value.startsWith("\"") && value.endsWith("\"")) {
						newValue = `"${newValue}"`;
					}
					outputData += `${key}=${newValue}\n`;
				} else {
					outputData += line + "\n";
				}
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