"use strict";

module.exports = {
  get: function(contents, key) {
    contents = contents || "";
    const members = typeof contents === 'object'
      ? contents.text.split("@")
      : contents.split("@");

    for(let i in members) {
      let entry = members[i];

      if (entry.startsWith(key)) {
        entry = key.includes("param")
          ? entry.replace(/\n/g, "")
          : entry;
        return entry.substr(key.length, entry.length - key.length).trim();
      }
    }

    return "";
  },
  getNotice: function(contents) {
    const notice = this.get(contents, "notice");
    const dev = this.get(contents, "dev");
    return notice.concat(dev);
  }
};