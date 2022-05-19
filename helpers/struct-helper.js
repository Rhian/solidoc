"use strict";

module.exports = {
    getStructLink: function(structName) {
        let linkedName = "";
        if (structName.includes(".")) {
        linkedName = `${structName.split(" ")[0]}`;
        return `[${linkedName}](${linkedName.split('.')[0]}.md#${linkedName.split('.')[1].toLowerCase()})`;
        }
    }
};
