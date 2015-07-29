  Meteor.npmRequire = function(moduleName) {                                             // 70
    var module = Npm.require(moduleName);                                                // 71
    return module;                                                                       // 72
  };                                                                                     // 73
                                                                                         // 74
  Meteor.require = function(moduleName) {                                                // 75
    console.warn('Meteor.require is deprecated. Please use Meteor.npmRequire instead!'); // 76
    return Meteor.npmRequire(moduleName);                                                // 77
  };                                                                                     // 78