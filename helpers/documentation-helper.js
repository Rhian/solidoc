"use strict";

module.exports = {
  get: function(contents, key) {
    contents = contents || "";
    const members = typeof contents === 'object'
      ? contents.text.split("@")
      : contents.split("@");

    for(let i in members) {
      let entry = members[i];

      if(entry.startsWith(key)) {
        entry = entry.replace(/\n/g, "");
        return entry.substr(key.length, entry.length - key.length).trim();
      }
    }

    return "";
  },
  getNotice: function(contents) {
    const title = this.get(contents, "notice");
    return title || this.get(contents, "dev");
  }
};