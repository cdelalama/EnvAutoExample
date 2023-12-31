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

## 2.2.0 - 2023-07-31
### Added
- Introduced an optional flag-based functionality for selective `.env.example` file generation. With the introduction of a new setting, the extension now provides the option to process only `.env` files marked with the `#example` flag for the generation of corresponding `.env.example` files. This setting can be toggled on and off based on user preference. When enabled, only `.env` files with the `#example` flag will be processed, while when disabled, the extension will generate `.env.example` files for all `.env` files except those marked with the `#noexample` flag.

## 2.2.1 - 2023-07-31
### Fixed
- Fixed a bug where the settings flag "Only Generate From Marked Files" was not being correctly read from the configuration. The bug resulted in `.env.example` files being generated from all `.env` files irrespective of the presence of the `#example` or `#noexample` flags. This fix ensures that the extension's behavior accurately reflects the selected configuration.

### Changed
- Refactored the codebase to improve modularity and readability. The `extension.ts` file now only contains the activation logic. A new `fileProcessor.ts` file was created to handle `.env` file processing, including generation and updating of `.env.example` files. Utility functions were moved to a separate `utils.ts` file for better organization and readability. This change enhances the maintainability of the codebase, making it easier to add features or resolve bugs in the future.