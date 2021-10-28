"use strict";
const nodeHelper = require("../helpers/node-helper");

module.exports = {
  build: function(node, contracts) {
    function getBaseContract(superId) {
      for(let i in contracts) {
        const contract = contracts[i];
        const result = nodeHelper.findNodeById(contract.ast.nodes, superId);

        if(result.id === superId) {
          return contract;
        }
      }
    }

    if(!node) {
      return "";
    }

    const builder = [];
    builder.push("⤾ ");
    builder.push("overrides ");

    const superId = node.superFunction || 0;

    if(superId == 0) {
      return "";
    }

    var baseContract = getBaseContract(superId);

    if (baseContract !== undefined) {
      if(!baseContract.ignore) {
        // If file is not ignored, then add link to file as well
        builder.push((!node.name)?`[${baseContract.contractName}](${baseContract.contractName}.md)`:`[${baseContract.contractName}.${node.name}](${baseContract.contractName}.md#${node.name.toLowerCase()})`);
      } else {
        // Otherwise, show file name but do not link it (since it is ignored)
        builder.push(`${baseContract.contractName}.${node.name}`);
      }
    } else {
      // If file could not be found because of something else, show ?
      builder.push("[?]");
    }

    return builder.join("");
  }
};