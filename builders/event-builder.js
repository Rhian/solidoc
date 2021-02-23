"use strict";
const i18n = require("../i18n");
const documentationHelper = require("../helpers/documentation-helper");
const argumentBuilder = require("../builders/argument-builder");

module.exports = {
  build: function(nodes) {
    if(!nodes || !nodes.length) {
      return "";
    }

    const builder = [];

    builder.push(`**${i18n.translate("Events")}**`);
    builder.push("\n");
    builder.push("\n");
    builder.push("\n");

    for(let i in nodes) {
      const node = nodes[i];
      const parameterList = [];

      for(let i in node.parameters.parameters) {
        const parameter = node.parameters.parameters[i];
        const argumentName = parameter.name;
        const dataType = parameter.typeDescriptions.typeString.replace("contract ", "");
        const indexed = parameter.indexed || false;

        parameterList.push(`${dataType} ${indexed ? "indexed" : ""} ${argumentName}`.trim());
      }

      if (!!node.documentation) {
        const doc = argumentBuilder.build(node.documentation, node.parameters.parameters);
        builder.push(doc);
      }

      builder.push("\n");
      builder.push("```js");
      builder.push("\n");
      builder.push(`event ${node.name}(${parameterList.join(", ")});`);
      builder.push("\n");
      builder.push("```");
      builder.push("\n");
      builder.push("---");
      builder.push("\n");
    }

    builder.push("\n");
    builder.push("\n");

    return builder.join("");
  }
};