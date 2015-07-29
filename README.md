# Meteor Dust: Boilerplate For Large Meteor Apps

A blank meteor application with some boilerplate that was born out of [this 
hackpad](https://meteor.hackpad.com/Building-Large-Apps-Tips-d8PQ848nLyE) that 
incorporates current best practices for creating a modular, all-packages app
and promotes a specific workflow that makes working with a large code-base much 
more manageable.

## How it Works

You'll notice there are 3 packages already included at `/packages`. That's 
because this boilerplate uses an all-packages approach, which has the following
benefits:

* Complete control over load order and the ability to include files without
 having Meteor automatically consume them, which is necessary if you want to
`require` any source files.

* It forces you to think about how your app is separated as well as explicitly
define any and all dependencies for each part of your application. If a module
depends on another module, then it must be state in `package.js`, and also 
results in an easy-to-reference file for other developers to understand tha 
relationships between all the modules.

Using all-packages is nothing new; However, this boilerplate defines a few 
packages by default which have specific purposes:

**`app-lib`:** This is where you will define any & all atmosphere packages that
your app depends on - your modules then in turn all depend on this package which
also gives this package another characteristic attribute:

 **__Any and all code in `app-lib` is guaranteed to load before your core 
modules, but after your 3rd-party (vendor) dependencies.__**

This makes `app-lib` ideal for a) defining utilities and interfaces for which
your modules can use & depend on for core functions related to your app, and 
b) for extending or adjusting all 3rd-party packages before your core modules
load them. Simply put, you can just consider `app-lib` the place to put any
code that should run **before** your main code (modules) runs.

* Next, you'll see `app-module` which is just an example for you to replace. You 
will make most of your app out of packages like this one, which must always
depend on `app-lib` before anything else. If a module depends on another of
your modules, then you must explicitly desfine that with an `api.use`. If
there's a package that only 1 or 2 modules use in the whole app, it might make
sense to require it in the module rather than `app-lib`.

* Lastly, each module should export a global variable under which all relevant
things are namespaced under (`api.export('Module1')`.

The 3rd and final package included is called `app-core`. This is also a very
important piece of the puzzle which is to be used as follows:

1. First, you `api.use` each of your modules (with `app-lib` first), which
effectively builds your application. You also get to define the order which
you want your modules to load in here. 

2. This package is meant to contai your main 'app' code, and what you
put here depends on what you're building. Any code that you put here is
guaranteed to load *after* all your modules have finished loading. This would
be a good place to put configurations for packages, startup code, and any
code that doesn't make sense to put into a module yet. 

3. Besides the abilty to run code in a specific context of load order, you
will have the ability to take  all the globals that were exported by your
modules and 3rd-party packages and namespace them under your main `App` global
namespace. 


## Directory structure

The way you structure each package is completely up to you, since you define
the context in the manifest. However, if you have no preference, here's my
recommendation:

```
app-projects/
   package.js
   lib/
      projects.js
      client/
      server/
```

As you can see, I keep it pretty simple. Since you have everything in packages,
you'll have a lot less depth to deal with. Keep it simple, then add more
structure only after your code in that package is outgrowing its structure. I 
also have a file in the root of `lib` named after the package, which defines
the global as well as the collection(s).



### Get Started

To use, simply fork, clone, and start building your app! I've included notes
in the comments of each core module to guide you through using this workflow. 

A big thanks to [TelescopeJS repo](https://github.com/TelescopeJS/Telescope) 
and creator Sacha for inventing most of the concepts in this boilerplate.

