"use strict";
const nodeHelper = require("../helpers/node-helper");
const eventBuilder = require("../builders/event-builder");
const templateHelper = require("../helpers/template-helper");
const documentationHelper = require("../helpers/documentation-helper");
const argumentBuilder = require("../builders/argument-builder");
const i18n = require("../i18n");


module.exports = {
  serialize: function(contract, template) {
    const eventNodes = nodeHelper.getEvents(contract);

    if(!eventNodes || !eventNodes.length) {
      return template.replace("{{Events}}", "");
    }

    const eventList = [];
    for (let i in eventNodes) {
      const node = eventNodes[i];
      let eventTemplate = templateHelper.EventTemplate;
      const eventName = `## ${node.name}`;
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

    template = template.replace("{{Events}}", eventList.join("\n"));

    return template;
  }
};
