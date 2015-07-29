// App: Library (First layer)
// * All packages used by the app (minus development-only packages) should
//   be defined here.
// * Code in this package is guaranteed to run before any other part of the app.
// * All other packages depend on this package. This is a great place to define
//   shared utilities as well as extend/add functionality to any packagee before
//   the application loads it.
Package.describe({
  name: 'app:lib', // All modules should api.use() this.
  summary: 'Application core library.',
  version: '1.0.0',
});

Package.onUse(function(api) {

  api.versionsFrom(['METEOR@1.0']);

  // Global packages
  // * You have 2 options for handling atmoshpere packages:
  //    1. Put all dependendencies for all modules here. Advantage is that all
  //       version constraints, load order, extending packages, and anything
  //       else can be done here, in one single file.
  //    2. Explicity define the dependencies for each module within its manifest
  //       which is more verbose and modular, but packages are defined in
  //       multiple places. You can always mix the two.
  var packages = [
    'mongo',
    'templating',
    'standard-app-packages',
    'iron:router',
    'check',
    'coffeescript',
    'fourseven:scss',
    'http',
    'jquery',
    'accounts-ui',
    'spiderable',
    'accounts-google',
    'sacha:spin',
    'cfs:standard-packages',
    'cfs:filesystem',
    'cfs:s3',
    'cfs:ejson-file',
    'cfs:ui',
    'meteorhacks:npm',
    'npm-container',
    'reywood:publish-composite',
    'ajduke:bootstrap-tagsinput',
    'accounts-password'
  ];

  api.use(packages);

  // Makes packages available in global context. If for some reason you don't
  // want that, just make 2 separate arrays above and don't imply one of them.
  // However, this is better done in app-core which still lets you manage
  // the namespaces of packages in the same way, but will still give your
  // modules access to them via global namespace.
  api.imply(packages);

  // Trick to set envrionment-specific packages. I personally use `direnv` to
  // automatically set the right environment vars for my meteor apps.
  if (process.env.IS_PRODUCTION) {
    api.use('xolvio:inspectlet');
    api.export('__insp');
  }


  // And now.. your files! I recommend you declare namespaces in your very first
  // file.
  api.addFiles([
    'lib/core.js' //,
    // 'lib/app.utils.js'
  ], ['client', 'server']);


  api.export([
    'App',
    'Secondary',
    '_'
  ]);
});
