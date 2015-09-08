// App: Core (3rd layer)
//
// * This is where your modules are built into an application. The only package
// you should have to `meteor add` is  `metepor add app:core`. This package
// also acts as an umbrella by including alll your app's dependencies/code, and
// alko acts as a namespace manager.
//
// *  In each module, you should have exported a single global variable with
//    anything that we might neeed to access. Here in app:core, move these
//    exports into the 'App' global namespace.

Package.describe({
  name: 'app:core',
  summary: 'Core application package.',
  version: '1.0.0',
  git: 'https://github.com/username/app-core'
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  // Here you add all your modules, and also define the load order by the way
  // you order them in this array. MAKE SURE app:lib always goes first!
  var packages = [
    'app:lib'//, // no dependencies
    // 'app:module1', // lib
    // 'app:module2', // ...
  ];

  api.use(packages); // all code => this package

  api.imply(packages); // this package => application


  // both
  api.addFiles([
    
  ]);

  // client
  api.addFiles([
    'lib/client/app.html',
    'lib/client/app.js'
  ], 'client');

  // server
  api.addFiles([

  ], 'server');


  // Last but not least.. (optional)
  api.export('App');

});




Package.onTest(function (api) {
  api.use([
    'app:core',
    'tinytest',
    'test-helpers',
    'templating',
    'reactive-dict'
  ], ['client']);
});
