"use strict";
const documentationHelper = require("../helpers/documentation-helper");
const structHelper = require("../helpers/struct-helper");

module.exports = {
  build: function(documentation, parameters) {
    if(!parameters || !parameters.length) {
      return "";
    }

    const builder = [];

    for(let i in parameters) {
      const parameter = parameters[i];
      let paramType = "";
      parameter.typeDescriptions.typeString.match(/struct/)
      ? paramType = structHelper.getStructLink(parameter.typeDescriptions.typeString.split(" ")[1])
      : paramType = parameter.typeDescriptions.typeString;
      
      builder.push("| ");
      builder.push(parameter.name);
      builder.push(" | ");
      builder.push(paramType.replace("contract ", ""));
      builder.push(" | ");
      const doc = documentationHelper.get(documentation, "param " + parameter.name);
      builder.push(doc);
      builder.push(" | ");
      builder.push("\n");
    }

    return builder.join("");
  }
};