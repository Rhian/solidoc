"use strict";

const fs = require("fs");
const glob = require("glob");
const pino = require("pino");

const logger = pino({
  prettyPrint: true
});

module.exports = {
  parse: function(buildDirectory, ignorePattern) {
    logger.info("Parsing %s. Ignoring %s", buildDirectory, ignorePattern);
    const contracts = [];
    const options = ignorePattern ? {
      ignore: ignorePattern.split(',')
    } : {}

    const files = glob.sync(buildDirectory + "/**/*.json", options);

    for(let i = 0; i < files.length; i++) {
      const data = fs.readFileSync(files[i]);
      contracts.push(JSON.parse(data));
    }

    return contracts;
  }
};