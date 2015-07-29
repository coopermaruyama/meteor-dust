/*global App,Network,Perspective,Quantify:true*/
/*****************************************************************************/
/* Global Initializer: This file is first in the load order */
/*****************************************************************************/
//
// Initialize all app namespaces
// --------------------------------------------------

App = {
  controllers: {},
  collections: {},
  schemas: {},
  views: {},
  utils: {},
  data: {} // fixtures, static content, etc.
};
App.Settings = Meteor.settings && Meteor.settings.public
                                      && Meteor.settings.public.App;

Secondary = {
  Controllers: {},
  Collections: {},
  ViewModels: {},
  Models: {},
  Schemas: {}
};

/*****************************************************************************/
/* Useful utilities (credit: iron-meteor) */
/*****************************************************************************/

/**
* Given a target object and a property name, if the value of that property is
* undefined, set a default value and return it. If the value is already
* defined, return the existing value.
*/
App.utils.defaultValue = function (target, prop, value) {
 if (typeof target[prop] === 'undefined') {
   target[prop] = value;
   return value;
 } else {
   return target[prop]
 }
};

//
// Utilities
// -------------------------------------------------------------------------------

/**
 * Assert that the given condition is truthy and throw an error if not.
 */

App.utils.assert = function (condition, msg) {
  if (!condition)
    throw new Error(msg);
};

/**
 * Print a warning message to the console if the console is defined.
 */
App.utils.warn = function (condition, msg) {
  if (!condition)
    console && console.warn && console.warn(msg);
};

/**
 * Make one constructor function inherit from another. Optionally provide
 * prototype properties for the child.
 *
 * @param {Function} Child The child constructor function.
 * @param {Function} Parent The parent constructor function.
 * @param {Object} [props] Prototype properties to add to the child
 */
App.utils.inherits = function (Child, Parent, props) {
  App.utils.assert(typeof Child !== "undefined", "Child is undefined in inherits function");
  App.utils.assert(typeof Parent !== "undefined", "Parent is undefined in inherits function");

  // copy static fields
  for (var key in Parent) {
    if (_.has(Parent, key))
      Child[key] = EJSON.clone(Parent[key]);
  }

  var Middle = function () {
    this.constructor = Child;
  };

  // hook up the proto chain
  Middle.prototype = Parent.prototype;
  Child.prototype = new Middle;
  Child.__super__ = Parent.prototype;

  // copy over the prototype props
  if (_.isObject(props))
    _.extend(Child.prototype, props);

  return Child;
};

/**
 * Create a new constructor function that inherits from Parent and copy in the
 * provided prototype properties.
 *
 * @param {Function} Parent The parent constructor function.
 * @param {Object} [props] Prototype properties to add to the child
 */
App.utils.extend = function (Parent, props) {
  props = props || {};

  var ctor = function () {
    // automatically call the parent constructor if a new one
    // isn't provided.
    var constructor;
    if (_.has(props, 'constructor'))
      constructor = props.constructor
    else
      constructor = ctor.__super__.constructor;

    constructor.apply(this, arguments);
  };

  return App.utils.inherits(ctor, Parent, props);
};

/**
 * Either window in the browser or global in NodeJS.
 */
App.utils.global = (function () {
  return Meteor.isClient ? window : global;
})();


/**
 * Ensure a given namespace exists and assign it to the given value or
 * return the existing value.
 *
 *  Example:
 *
 *  console.log(typeof MyObject)
 *  > ReferenceError: MyObject is not defined
 *
 *  App.utils.namespace('MyObject.Foo.Bar.Baz')
 *  console.log( MyObject )
 *  > Object {Foo: Bar: {} } //Note that the 'Baz' was not set since we used 1 parameter
 *
 * App.utils.namespace('MyObject.Thing.Foo.Bar', {first: 'some val'})
 * console.log( MyObject )
 * > {
 * >   Thing: {
 * >     Foo: {
 * >       Bar: { first: 'some val' }
 * >     }
 * >   }
 * > }
 *
 * // We can deepen defined namespaces without overwriting
 * App.utils.namespace('MyObject.Thing.Foo.Bar.Baz.Lib', myFunction)
 * console.log( MyObject.Thig.Foo )
 * > {
 * >   Bar: {
 * >     first: 'some val',
 * >      Baz: { Lib: myFunction }
 * >   }
 * > }
 *
 *
 * How to export globals from .coffee files & guarantee you don't overwrite:
 *
 * // lib/App/Modules/FooModule.coffee
 * // 1. Start by importing all dependencies
 * utils = App.utils
 * Schemas = App.Schemas
 * Modules = App.Modules ...
 *
 * // 2. Create your class or library
 * class MyModule
 *   @classVar: 12
 *   @classMethod: -> #...
 *   constructor: (@options = {}) ->
 *   insanceVar: 5
 *   instanceMethod: ->
 *     # do stuff
 *
 * // 3. Export
 * App.utils.namespace('App.Modules.MyModule', MyModule);
 *
 *
 *
 *
 * var utils = App.utils,
 *     ns = utils.namespace('App.Modules.FooModule'),
 *     fooModule = utils.defaultValue(App.Modules, 'FooModule', {});
 *
 *
 *
 *
 */
App.utils.namespace = function (namespace, value) {
  var global = App.utils.global;
  var parts;
  var part;
  var name;
  var ptr;

  App.utils.assert(typeof namespace === 'string', "namespace must be a string");

  parts = namespace.split('.');
  name = parts.pop();
  ptr = global;

  for (var i = 0; i < parts.length; i++) {
    part = parts[i];
    ptr = ptr[part] = ptr[part] || {};
  }

  if (arguments.length === 2) {
    ptr[name] = value;
    return value;
  } else {
    return ptr[name];
  }
};
/**
 * Returns the resolved value at the given namespace or the value itself if it's
 * not a string.
 *
 * Example:
 *
 * var App = {};
 * App.foo = {};
 *
 * var baz = App.foo.baz = {};
 * App.utils.resolve("App.foo.baz") === baz
 */
App.utils.resolve = function (nameOrValue) {
  var global = App.utils.global;
  var parts;
  var ptr;

  if (typeof nameOrValue === 'string') {
    parts = nameOrValue.split('.');
    ptr = global;
    for (var i = 0; i < parts.length; i++) {
      ptr = ptr[parts[i]];
      if (!ptr)
        return undefined;
    }
  } else {
    ptr = nameOrValue;
  }

  // final position of ptr should be the resolved value
  return ptr;
};


/**
 * Utility for accessing helpers from another helper, even when the current
 *  context gets set to something non-templatey like a collection or something.
 *
 * @param   {object} template - Name of template as in <template name="name">
 * @param   {string} helperName - Exact name of helper.
 * @returns {object} helper
 */
App.utils.getHelper = function(template, helperName) {
  if (! template instanceof Template) {
    throw new Error('template arg needs to be an instance of `Template`');
  }
  if (! typeof(helperName) == "string") {
    throw new Error('helperName needs to be a string.');
  }
  return Blaze._getTemplateHelper(template, helperName);
}

// make sure App ends up in the global namespace
App.utils.global.App = App;
App.utils.global.Secondary = Secondary;
