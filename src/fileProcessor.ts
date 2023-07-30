import * as fs from "fs";
import * as vscode from "vscode";
import { delay, ignoreFile, processLine } from "./utils";

export async function processEnvFile(envFilePath: string) {
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
