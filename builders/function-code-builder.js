"use strict";
const documentationHelper = require("../helpers/documentation-helper");
const enumerable = require("linq");
const nodeHelper = require("../helpers/node-helper");
const argumentBuilder = require("../builders/argument-builder");
const i18n = require("../i18n");

module.exports = {
  build: function(node) {
    function getReturnParameters() {
      const builder = [];

      var returnParameters = nodeHelper.getReturnParameters(node);

      if(!returnParameters || !returnParameters.length) {
        return "";
      }

      builder.push("returns(");

      const returnList = [];

      for(let i in returnParameters) {
        const parameter = returnParameters[i];
        if(parameter.typeDescriptions.typeString.match(/struct/)) {
          let reorderedType = parameter.typeDescriptions.typeString.split(" ").reverse().join(" ");
          returnList.push(`${reorderedType}`);
        } else {
          returnList.push(`${parameter.name} ${parameter.typeDescriptions.typeString}`.trim());
        }
      }

      builder.push(returnList.join(", "));

      builder.push(")");

      return builder.join("");
    }

    function signatureReturnValues() {
      const builder = [];

      var returnParameters = nodeHelper.getReturnParameters(node);

      if(!returnParameters || !returnParameters.length) {
        return "";
      }

      builder.push("returns(");

      const signatureReturnList = [];

      for(let i in returnParameters) {
        const parameter = returnParameters[i];
        if (parameter.typeDescriptions.typeString.match(/struct/) && parameter.typeName.pathNode) {
          signatureReturnList.push(`${parameter.typeName.pathNode.name} ${parameter.storageLocation} ${parameter.name}`);
        } else if (parameter.typeDescriptions.typeString.match(/struct/)) {
          signatureReturnList.push(`${parameter.typeDescriptions.typeString.split(" ")[1]} ${parameter.storageLocation} ${parameter.name}`);
        } else {
          signatureReturnList.push(`${parameter.typeDescriptions.typeString} ${parameter.name}`.trim());
        }
      }

      builder.push(signatureReturnList.join(", "));

      builder.push(")");

      return builder.join("");
    }

    if(!node || !node.parameters) {
      return "";
    }

    const builder = [];

    const parameters = node.parameters.parameters || [];
    const documentation = node.documentation;
    const returnParameters = getReturnParameters();
    const sigReturnValues = signatureReturnValues();
    const args = argumentBuilder.build(node.documentation, parameters);
    const returnDocumentation = documentationHelper.getReturnDetail(documentation);
    const returnValues = documentationHelper.createReturnValues(returnParameters, returnDocumentation);
   
    const parameterList = [];

    const argsHeader = "| Name        | Type           | Description  |";
    const argsDivider = "| ------------- |------------- | -----|";

    const modifierList = enumerable.from(node.modifiers).select(function(x) {
      return x.modifierName.name.trim();
    }).toArray();

    for(let i in parameters) {
      const parameter = parameters[i];
      const argumentName = parameter.name;
      const dataType = parameter.typeDescriptions.typeString.replace("contract ", "");
      parameterList.push(`${dataType} ${argumentName}`);
    }

    builder.push("```solidity");
    builder.push("\n");
    builder.push(`function ${node.name}(`);

    parameterList.length > 1 ?
      builder.push(parameterList.join(",\n ")) :
      builder.push(parameterList.join(", "))

    builder.push(") ");

    builder.push("\n" + node.visibility.toLowerCase());

    let stateMutability;

    node.stateMutability === "nonpayable" ?
      stateMutability = "" :
      stateMutability = node.stateMutability
    
    builder.push("\n" + `${stateMutability}`);

    if(modifierList && modifierList.length) {
      builder.push(`${modifierList.join(" ")} `);
    }

    let styledSigReturnValues;
  
    sigReturnValues.split(",").length > 2
      ? styledSigReturnValues = sigReturnValues.replace(/, /g, ",\n ") 
      : styledSigReturnValues = sigReturnValues

    if(signatureReturnValues) {
      builder.push("\n");
      builder.push(styledSigReturnValues);
    }

    builder.push("\n");
    builder.push("```");

    if(!returnParameters && !args) {
      return builder.join("");
    }

    builder.push("\n");

    if(args.length) {
      builder.push(`**${i18n.translate("Arguments")}**`);
      builder.push("\n");
      builder.push("\n");
      builder.push(`${argsHeader}`);
      builder.push("\n");
      builder.push(`${argsDivider}`);
      builder.push("\n");
      builder.push(`${args}`);
      builder.push("\n");
    }

    if(!returnParameters) {
      return builder.join("");
    }

    builder.push(`**${i18n.translate("Returns")}**`);
    builder.push("\n");
    builder.push("\n");
    builder.push("\n");
    builder.push(`${returnValues}`);
    builder.push("\n");

    return builder.join("");
  }
};