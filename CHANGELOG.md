# Change Log

All notable changes to the "envautoexample" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Initial release

## 1.3.0 - 2023-07-27
### Added
- Enhanced the `.env.example` file generation to preserve comments from the original `.env` file. Now, comments following a `#` symbol on the same line as a variable assignment will be included in the generated `.env.example` file. This helps maintain important contextual information while still masking actual values.

## 2.0.0 - [2023-07-27]
### Added
- Expanded the extension to support multiple `.env` files. The extension can now generate `.example` files for any `.env.*` files in your project. This includes files such as `.env.test`, `.env.production`, etc. Each of these will have a corresponding `.env.test.example`, `.env.production.example` file, respectively, where sensitive information is replaced with placeholders.

## 2.1.0 - 2023-07-28
### Added
- Added the ability to exclude specific `.env` files from being processed. By adding a `#noexample` flag to the first line of a `.env` file, the extension will ignore this file when generating the `.env.example` files. This provides users with more control and flexibility when working with various `.env` files.