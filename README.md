# EnvAutoExample Extension
![Image Alt Text](assets/envAutoExample.gif)
Automate `.env.example` file generation by scanning existing `.env` files in projects, masking sensitive information, and creating corresponding `.env.example` files with placeholders. This efficiently maintains up-to-date example configurations while keeping actual values secure.

## Key Features

- Automatically generate a `.env.example` file based on the existing `.env` file.
- Update `.env.example` each time the `.env` file is saved.
- Replace sensitive data with placeholders.
- Minimize manual intervention by automating the updating process.

## How to Use

1. Install the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MamaCarlos.envautoexample).
2. Open a project that contains a `.env` file.
3. Use the "Generate .env.example from .env" command from the Command Palette (press `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) or simply save your `.env` file to trigger an update of `.env.example`.

