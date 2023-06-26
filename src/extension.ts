import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
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
}

function generateEnvExample(envFilePath: string, outputFilePath: string): void {
	if (!fs.existsSync(envFilePath)) {
		throw new Error(`File not found: ${envFilePath}`);
	}

	const envData = fs.readFileSync(envFilePath, { encoding: "utf-8" });
	const lines = envData.split("\n");

	let outputData = "";
	for (const line of lines) {
		if (line.includes("=")) {
			const [key] = line.trim().split("=", 1);
			outputData += `${key}=your-${key.toLowerCase()}\n`;
		} else {
			outputData += line + "\n";
		}
	}

	fs.writeFileSync(outputFilePath, outputData);
}
