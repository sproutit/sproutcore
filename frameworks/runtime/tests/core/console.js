// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

module("Console object");

test("The console object should be defined for all browsers and work if supported", function() {
  ok((console!==undefined), "console should not be undefined");
  console.info("Console.info is working");
  console.log("Console.log is working");
  console.warn("Console.warn is working");
  console.error("Console.error is working");
});

plan.run();
