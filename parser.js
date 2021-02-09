"use strict";

const fs = require("fs");
const glob = require("glob");
const pino = require("pino");
const { exit } = require("process");

const logger = pino({
  prettyPrint: true
});

module.exports = {
  parse: function(buildDirectory, ignoreFiles) {
    logger.info("Parsing %s", buildDirectory);
    logger.info("Ignoring %s", ignoreFiles);
    const contracts = [];
    // No longer necessary since we are ignoring files by adding a property to 'contract' object.
    // const options = ignoreFiles ? {
    //   ignore: ignoreFiles
    // } : {}

    const files = glob.sync(buildDirectory + "/**/*.json");//, options);

    for (let i = 0; i < files.length; i++) {
      const data = fs.readFileSync(files[i]);
      var contract = JSON.parse(data);
      // Ignore the file if it is in the array of ignore pattern
      contract.ignore = ignoreFiles.filter(f => files[i].indexOf(f) > 0).length > 0;
      contracts.push(contract);
    }

    return contracts;
  }
};