"use strict";
const templateHelper = require("../helpers/template-helper");
const structHelper = require("../helpers/struct-helper");

module.exports = {
  get: function(contents, key) {
    contents = contents || "";
    const members = typeof contents === 'object'
      ? contents.text.split("@")
      : contents.split("@")

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
  getReturnDetail: function(contents) {
    contents = contents || "";
    const members = typeof contents === 'object'
      ? contents.text.split("@")
      : contents.split("@")

    let entry = Object.values(members).filter(function(x) { return x.startsWith("return") });
    return entry.join("").replace(/return/g, "").replace(/ - /g, "\n");
  },
  getNotice: function(contents) {
    const notice = this.get(contents, "notice");
    const devText = this.get(contents, "dev");
    const dev = devText.replace(/====/g, "");
    return notice.concat(dev).replace(/\n/g, "<br/>");
  },
  createReturnValues: function(a,b) {
    const header = templateHelper.TableHeaderTemplate;
    const dataTypes = [/bytes/, /uint/, /address/, /string/, /bool/, /enum/, /mapping/]
    const returnParams = a.split("returns(").pop().replace(")", '').replace(",", '').split(" ");
    function sliceIntoChunks(arr, chunkSize) {
      const res = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
          const chunk = arr.slice(i, i + chunkSize);
          res.push(chunk);
      }
      return res;
    }
    const returnInfo = b.split("\n");
    const returnParamsArr = sliceIntoChunks(returnParams, 2);
    let returnInfoArr;

    returnInfo.length > 1 ? returnInfoArr = sliceIntoChunks(returnInfo, 2) : returnInfoArr = returnInfo

    function returnMarkdown(arr, arr2) {
      let description = "";
      let fullName;
      let type;

      if (arr[1].includes("struct") && arr2 && arr2[1]) {
          description = arr2[1].replace(/\{(.+?)\}/, `{${structHelper.getStructLink(arr[0])}}`);
          type = structHelper.getStructLink(arr[0]);
          fullName =  arr2[0];
      } else if (arr[1].includes("struct") && arr2 && !arr2[0] === "") {
          fullName = arr2[0];
          type = structHelper.getStructLink(arr[0]);
      } else if (arr[1].includes("struct")) {
          fullName = arr[0];
          type = structHelper.getStructLink(arr[0]);
        } else if (dataTypes.some(x => x.test(arr[0]))) {
          fullName = " ";
          type = arr[0].concat(` ${arr[1]}`);
          (arr2 && arr2[0].trim().match(arr[0])) ? description = arr2[1] : description = "";
      } else {
          fullName = arr[0];
          type = arr[1];
          (arr2 && arr2[0].trim().match(arr[0])) ? description = arr2[1] : description = "";
      }
      return arr.length < 2 ? fullName :  `\n| ${fullName} | ${type} | ${description} |`
    }

    let tableContent = "";
    for (let i = 0; i < returnParamsArr.length; i++) {
      returnParamsArr[i].length > 1 
        ? tableContent = tableContent.concat(returnMarkdown(returnParamsArr[i], returnInfoArr[i]))
        : tableContent = returnParamsArr[i][0];
  }
    let returnTable = "";
    tableContent.includes("|") 
      ? returnTable = header.concat(tableContent) 
      : returnTable = tableContent;
    return returnTable;
  }
};