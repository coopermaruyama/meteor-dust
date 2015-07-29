  var path = Npm.require('path');                                                        // 82
  var fs = Npm.require('fs');                                                            // 83
                                                                                         // 84
  Package.describe({                                                                     // 85
    summary: 'Contains all your npm dependencies',                                       // 86
    version: '1.0.0',                                                                    // 87
    name: 'npm-container'                                                                // 88
  });                                                                                    // 89
                                                                                         // 90
  var packagesJsonFile = path.resolve('./packages.json');                                // 91
  try {                                                                                  // 92
    var fileContent = fs.readFileSync(packagesJsonFile);                                 // 93
    var packages = JSON.parse(fileContent.toString());                                   // 94
    Npm.depends(packages);                                                               // 95
  } catch(ex) {                                                                          // 96
    console.error('ERROR: packages.json parsing error [ ' + ex.message + ' ]');          // 97
  }                                                                                      // 98
                                                                                         // 99
  Package.onUse(function(api) {                                                          // 100
    api.add_files(['index.js', '../../packages.json'], 'server');                        // 101
  });                                                                                    // 102