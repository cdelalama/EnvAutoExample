import * as vscode from "vscode";
import * as path from "path";
import { processEnvFile } from "./fileProcessor";

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
