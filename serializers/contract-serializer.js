"use strict";
const documentationHelper = require("../helpers/documentation-helper");
const nodeHelper = require("../helpers/node-helper");
const constructorBuilder = require("../builders/constructor-builder");
const i18n = require("../i18n");
const util = require("util");
const path = require("path");
const relative = require("path").relative;

module.exports = {
  serialize: function(contract, template, contracts) {
    function getTitle() {
      const contractNode = nodeHelper.getContractNode(contract);
      const documentation = contractNode.documentation;
      const contractTitle = documentationHelper.get(documentation, "title");

      let title = `${contract.contractName}`;

      return title;
    }

    function getNotice() {
      const contractNode = nodeHelper.getContractNode(contract);
      const documentation = contractNode.documentation;
      const noticeText = documentationHelper.get(documentation, "notice");

      const notice = noticeText.replace("\n", "<br/>")

      return notice;
    }

    function getAbi() {
      const builder = [];
      builder.push("## ");
      builder.push(i18n.translate("ABI"));
      builder.push("\n\n");
      builder.push("```json\n");
      builder.push(JSON.stringify(contract.abi, null, 2));
      builder.push("\n```");

      return builder.join("");
    }

    function getContractPath() {
      const sourcePath = contract.sourcePath;
      const relation = relative(global.config.outputPath, global.config.pathToRoot);
      const file = sourcePath.replace(global.config.pathToRoot, "");
      const link = `[${file.replace(/^\/|\/$/g, "")}](${path.join(relation, file)})`;

      return util.format(i18n.translate("ViewSource"), link);
    }

    function getAnchors() {
      const anchors = [];

      for(let i in contracts) {
        const contract = contracts[i];

        const anchor = `* ${contract.contractName}`;
        anchors.push(anchor);
      }

      return anchors;
    }

    function getInheritancePath() {
      const dependencyList = [];
      const dependencies = nodeHelper.getBaseContracts(contract);

      for(let i in dependencies) {
        const dependency = dependencies[i];
        dependencyList.push(`${dependency.baseName.name}`);
      }

      if(dependencyList && dependencyList.length) {
        return `**${util.format(i18n.translate("Extends"), dependencyList.join(", "))}**`;
      }

      return "";
    }

    function getImplementation() {
      const implementationList = [];
      const implementations = nodeHelper.getImplementations(contract, contracts);

      for(let i in implementations) {
        const implementation = implementations[i];

        implementationList.push(`${implementation.contractName}`);
      }

      if(implementationList && implementationList.length) {
        return `**${util.format(i18n.translate("DerivedContracts"), implementationList.join(", "))}**`;
      }

      return "";
    }

    const contractNode = nodeHelper.getContractNode(contract);
    const documentation = contractNode.documentation;

    template = template.replace(/{{ContractName}}/g, contract.contractName);
    template = template.replace("{{ContractPath}}", getContractPath());
    template = template.replace("{{ContractTitle}}", getTitle());
    template = template.replace("{{ContractDescription}}", getNotice());
    template = template.replace("{{ContractInheritancePath}}", getInheritancePath());
    template = template.replace("{{ContractImplementations}}", getImplementation());

    template = template.replace("{{AllContractsAnchor}}", getAnchors().join("\n"));
    template = template.replace("{{ABI}}", getAbi());
    template = template.replace("{{version}}", global.config.version);
    if (global.config.version) {
      template = template.replace("{{versionDetail}}", ` - version: ${global.config.version}`);
    } else {
      template = template.replace("{{versionDetail}}", "");
    }

    return constructorBuilder.build(contract, template);
  }
};