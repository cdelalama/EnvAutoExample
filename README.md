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

## How to Use

1. Install the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MamaCarlos.envautoexample).
2. Open a project that contains a `.env` file or multiple `.env.*` files.
3. The extension automatically generates corresponding `.env.example` or `.env.*.example` files when you open the project. You can also use the "Generate .env.example from .env" command from the Command Palette (press `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) or simply save your `.env` or `.env.*` file to trigger an update of `.env.example` or `.env.*.example` files.
4. Comments in your `.env` or `.env.*` files that follow a `#` symbol on the same line as a variable assignment will be preserved in the generated `.env.example` or `.env.*.example` files. This provides context for each configuration item while keeping the actual values masked.
5. To exclude a specific `.env` file from being processed, simply add `#noexample` as the first line in the file. The extension will ignore this file when generating the `.env.example` files.
6. Use `.env.example` or `.env.*.example` files as templates for new environments. Replace the placeholder values with your actual values.
