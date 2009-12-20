// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

var currentRoute;

var handleRoute = function(url) {
  currentRoute = url.url;
};

module("SC.routes", {
  
  setup: function() {
    currentRoute = null;
    SC.routes.add(':url', handleRoute);
  },
  
  teardown: function() {
    SC.routes.set('location', '');
  }
  
});

test("Routes with UTF-8 characters", function() {
  SC.routes.set('location', 'éàçùß€');
  equals(currentRoute, 'éàçùß€');
  stop();
  setTimeout(function() {
    start();
    equals(currentRoute, 'éàçùß€');
  }, 1200);
});

plan.run();
