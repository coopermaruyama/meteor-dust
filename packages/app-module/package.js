// App: Module (Layer 2)
//
// * Most of your app's code will be in the form of these modules. How you
//  decide to separate your modules will affect your workflow greatly so think
//  hard! Tip: your collections are usually good indicators of separation. If
//   you create one called 'app-collections' or 'app-views' you're doing it
//   wrong.
//
// * Each package should export a single gloval variable, unique to that module.
Package.describe({
  name: "app:module", // Reference you'll use in other modules to add this one.
  summary: "Some info" ,
  version: "0.1.0",
  git: "https://github.com/coopermaruyama/meteor-dust"
});

Package.onUse(function(api) {
  api.versionsFrom("1.0.1");

  // Dependencies
  api.use([
    "app:lib" // always goes first
    // "app:module2" // If your module depends on another, add it.
  ]);

  // Server files
  api.addFiles([
    // "lib/server/modules.js"
  ], "server");

  // Shared files
  api.addFiles([
    // "lib/module.js"
  ]);

  // Client files
  api.addFiles([
    // lib/client/modulesjs""
  ], "client");

  // Exports
  api.export("Module");
});


Package.onTest(function (api) {
  // api.use("tinytest");
  api.use("app:module");
});
