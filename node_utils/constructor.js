"use strict";
const enumerable = require("linq");

module.exports = {
  getConstructorNode: function(contract) {
    var constructorNode = enumerable.from(contract.ast.nodes).where(function(x) {
      if(x.kind && x.kind == "constructor") {
        return x.kind;
      }
    }).firstOrDefault();

    if(constructorNode) {
      return constructorNode;
    }

    for(let i in contract.ast.nodes) {
      const node = contract.ast.nodes[i];

      constructorNode = enumerable.from(node.nodes).where(function(x) {
        if(x.kind && x.kind == "constructor") {
          return x.kind;
        }
      }).firstOrDefault();

      if(constructorNode) {
        return constructorNode;
      }
    }

    return {};
  }
};
