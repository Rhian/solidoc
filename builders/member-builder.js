"use strict";
const enumerable = require("linq");
const i18n = require("../i18n");
const util = require("util");
const documentationHelper = require("../helpers/documentation-helper");

module.exports = {
  build: function(nodes) {
    if(!nodes || !nodes.length) {
      return "";
    }

    const builder = [];

    builder.push(`## ${i18n.translate("ContractMembers")}`);
    builder.push("\n");
    builder.push(`**${i18n.translate("ConstantsAndVariables")}**`);
    builder.push("\n");
    builder.push("\n");

    const groups = enumerable.from(nodes).groupBy(function(x) {
      return x.visibility.toLowerCase();
    }).toArray();

    for(let i in groups) {
      const group = groups[i];
      const key = group.key();

      const candidates = enumerable.from(nodes).where(function(x) {
        return x.visibility.toLowerCase() === key;
      }).toArray();

      for(var j in candidates) {
        const node = candidates[j];
        const constant = node.constant ? " constant " : " ";

        if(!node.typeDescriptions) {
          continue;
        }

        if (!!node.documentation) {
          const doc = documentationHelper.getNotice(node.documentation);
          builder.push(doc);
        }
        builder.push("\n");
        builder.push("```solidity");
        builder.push("\n");
        builder.push(`${node.typeDescriptions.typeString} ${node.visibility.toLowerCase()}${constant}${node.name}`);

        builder.push(";");
        builder.push("\n");
        builder.push("```");
        builder.push("\n");
        builder.push("\n");
        builder.push("\n");
      }

      builder.push("\n");
    }

    builder.push("\n");
    builder.push("\n");

    return builder.join("");
  }
};