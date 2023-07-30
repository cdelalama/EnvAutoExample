# EnvAutoExample Extension
![Image Alt Text](assets/envAutoExample.gif)
Automate `.env.example` file generation by scanning existing `.env` files in projects, masking sensitive information, and creating corresponding `.env.example` files with placeholders. This efficiently maintains up-to-date example configurations while keeping actual values secure.

## Key Features

- Automatically generate a `.env.example` file based on the existing `.env` file.
- Support for multiple `.env.*` files (e.g. `.env.test`, `.env.production`). The extension can generate corresponding `.env.*.example` files.
- Update `.env.example` each time the `.env` file is saved.
- Replace sensitive data with placeholders.
- Preserve comments from the `.env` file in the generated `.env.example` file.
- Minimize manual intervention by automating the updating process.
- Exclude specific `.env` files from being processed using a flag in the first line (e.g., `#noexample`).
- Newly introduced **configuration option** to specify an inclusion flag, `#example`, for processing .env files. If this configuration is set, only the .env files with `#example` on the first line will generate the respective .env.example files.

## How to Use

1. Install the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MamaCarlos.envautoexample).
2. Open a project that contains a `.env` file or multiple `.env.*` files.
3. The extension automatically generates corresponding `.env.example` or `.env.*.example` files when you open the project. You can also use the "Generate .env.example from .env" command from the Command Palette (press `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) or simply save your `.env` or `.env.*` file to trigger an update of `.env.example` or `.env.*.example` files.
4. Comments in your `.env` or `.env.*` files that follow a `#` symbol on the same line as a variable assignment will be preserved in the generated `.env.example` or `.env.*.example` files. This provides context for each configuration item while keeping the actual values masked.
5. To exclude a specific `.env` file from being processed, simply add `#noexample` as the first line in the file. The extension will ignore this file when generating the `.env.example` files.
6. To set the new configuration option, go to the VS Code settings and search for "Env Auto Example". When the "Only Generate From Marked Files" option is checked (`true`), the extension will only process .env files with a `#example` flag in the first line. In this case, `.env.example` files will be created only for `.env` files marked with `#example`, and if the flag is removed, the corresponding `.env.example` file will be deleted. When the option is unchecked (`false`), the extension will generate `.env.example` files for all `.env` files, unless they are marked with `#noexample`. If a `.env` file is marked with `#noexample`, it will be ignored and no corresponding `.env.example` file will be created.

This feature provides the option to decide whether the extension should automatically process all `.env` files for generating corresponding `.env.example` files, or only those specifically marked with a '#example' flag. This capability enables granular control over which `.env` files should be processed, allowing for privacy of certain environment configurations while exposing others. It is particularly useful in larger projects where multiple environment configurations exist, or when certain sensitive configurations are best left without a corresponding example file.
