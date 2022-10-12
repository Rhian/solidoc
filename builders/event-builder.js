"use strict";
const i18n = require("../i18n");
const documentationHelper = require("../helpers/documentation-helper");
const argumentBuilder = require("../builders/argument-builder");

module.exports = {
  build: function(node) {

  const builder = [];

  const parameterList = [];
  
  for(let i in node.parameters.parameters) {
      const parameter = node.parameters.parameters[i];
      const argumentName = parameter.name;
      const dataType = parameter.typeDescriptions.typeString.replace("contract ", "");
      const indexed = parameter.indexed || false;

      parameterList.push(`${dataType} ${indexed ? "indexed" : ""} ${argumentName}`.trim());
    }

    builder.push("\n");
    builder.push("```solidity");
    builder.push("\n");
    builder.push(`event ${node.name}(`);
    parameterList.length > 1 ?
    builder.push("\n " + parameterList.join("\n ") + "\n") :
    builder.push(parameterList.join(", "))
    builder.push(")");
    builder.push("\n");
    builder.push("```");
    builder.push("\n");

    builder.push("\n");
    builder.push("\n");

    return builder.join("");
  }
};
