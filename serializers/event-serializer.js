"use strict";
const nodeHelper = require("../helpers/node-helper");
const enumerable = require("linq");
const templateHelper = require("../helpers/template-helper");
const documentationHelper = require("../helpers/documentation-helper");
const eventBuilder = require("../builders/event-builder");
const argumentBuilder = require("../builders/argument-builder");
const i18n = require("../i18n");

module.exports = {
  serialize: function(contract, template, contracts) {
    function clean() {
      template = template.replace("{{EventTitle}}", "");
      template = template.replace("{{EventList}}", "");
      template = template.replace("{{AllEvents}}", "");
      return template;
    }

    const eventNodes = nodeHelper.getEvents(contract);

    if(!eventNodes || !eventNodes.length) {
      return template.replace("{{Events}}", "");
    }

    const definitionList = [];
    const eventList = enumerable.from(eventNodes).select(function(x) {
      const parameters = x.parameters.parameters || [];
      const parameterList = [];

      for(let i in parameters) {
        const parameter = parameters[i];
        const argumentName = parameter.name;
        const dataType = parameter.typeDescriptions.typeString.replace("contract ", "");
        parameterList.push(`${dataType} ${argumentName}`);
      }

      return `- [${x.name}](#${x.name.toLowerCase()})`;
    }).toArray();

    for (let i in eventNodes) {
      const node = eventNodes[i];
      let eventTemplate = templateHelper.EventTemplate;
      const eventName = `### ${node.name}`;
      const eventDescription = documentationHelper.getNotice(node.documentation);
      const eventCode = eventBuilder.build(node);
      const params = argumentBuilder.build(node.documentation, node.parameters.parameters);

      eventTemplate = eventTemplate.replace("{{EventName}}", eventName);
      eventTemplate = eventTemplate.replace("{{EventDescription}}", eventDescription);
      eventTemplate = eventTemplate.replace("{{EventCode}}", eventCode);
      eventTemplate = eventTemplate.replace("{{TableHeader}}", templateHelper.TableHeaderTemplate);
      eventTemplate = eventTemplate.replace("{{EventParameters}}", params);
      eventTemplate = eventTemplate.replace("{{Parameters}}", `**${i18n.translate("Parameters")}**`);

      eventList.push(eventTemplate);
    }
    let eventContent = `## ${i18n.translate("Events")} \n \n ${eventList.join("\n")}`;
    template = template.replace("{{Events}}", eventContent);

    return template;
  }
};
