// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import core_test:qunit";
var SC = require('index'); // load sproutcore/foundation
var system = require('system', 'default');

// An ObjectController will make a content object or an array of content objects 
module("SC.objectForPropertyPath") ;

test("should be able to resolve an object on the window", function() {
  var myLocal = (system.global.myGlobal = { test: 'this '}) ;
  
  same(myLocal, { test: 'this '}) ;
  same(window.myGlobal, { test: 'this '}) ;
  
  // verify we can resolve our binding path
  same(SC.objectForPropertyPath('myGlobal'), { test: 'this '}, 'SC.objectForPropertyPath()') ;
  
  system.global.myGlobal =null ;
});

run();
