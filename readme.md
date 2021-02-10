# Solidoc: Documentation Generator for Solidity

[![npm version](https://badge.fury.io/js/%40thinkanddev%2Fsolidoc.svg)](https://www.npmjs.com/package/@thinkanddev/solidoc)

This command-line utility creates markdown-based documentation for your Solidity project(s) for the following platforms:

* Ethereum
* Ethereum Classic
* Tron
* Qtum
* Wanchain
* Aeternity
* Counterparty
* Rootstock
* Ubiq
* Monax


## Getting Started

**Global instalation**

```npm
sudo npm install solidoc -g
```

**Project instalation**

```npm
npm install solidoc
```

**CLI Arguments**

1. Path to Truffle project (or similar) root.
2. Path to generate documentation to.
3. Do not recompile. Optional, default: false.
4. Compiler. Truffle compiler (use `npx truffle compiler` to use the same compiler as the project, instead of global install of Truffle).
5. Language. Optional, default: en.
6. Version. Optional, refers to contracts version (depends on the project).
7. Ignore files. Optional, array with filenames to ignore.

Using a [configuration file](#configuration-file) is recommended (mostly if you want to ignore files).


**How to Use Solidoc?**

On your project root, run the following command:

```npm
solidoc ./ ./docs true
```

This will generate documentation to the `docs` directory.

**Or edit package.json**

```json
  "scripts": {
    "docgen": "solidoc ./ ./docs"
  }
```

and run:

```npm
npm run docgen
```

**Note**

Do not use recompilation (third argument) if you are using this on a non Truffle project.

## Configuration File

Alternatively, you can create `solidoc.json` configuration file in your project root:

```json
{
  "pathToRoot": "./",
  "outputPath": "./docs",
  "noCompilation": true,
  "compiler": "truffle compile",
  "language": "en",
  "version": "0.1.10",
  "ignoreFiles": []
}
```

and then call `solidoc` instead of passing any command line argument.


## Overrides

If you wish to change bits and pieces of the documentation generated, place `solidoc templates` on the following directory:

`./.solidoc/templates/`

[Solidoc Templates](templates)


You can also override language literals by copying and editing `i18n` files on the following path:

`./.solidoc/i18n/`



## Before You Try

- [OpenZeppelin Solidity Documentation](https://github.com/binodnp/openzeppelin-solidity/blob/master/docs/ERC721.md)
- [Open Source Vesting Schedule by Binod](https://github.com/binodnp/vesting-schedule/blob/master/docs/VestingSchedule.md)
- [Virtual Rehab Token](https://github.com/ViRehab/VirtualRehabToken/blob/master/docs/VRHToken.md)
- [Virtual Rehab Private Sale](https://github.com/ViRehab/VirtualRehabPrivateSale/blob/master/docs/PrivateSale.md)