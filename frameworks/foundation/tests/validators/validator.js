// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

module("SC.Validator");

test("Calling fieldValueForObject() should not fail if this.prototypefieldValueForObject() is null", function() {
  var Klass = SC.Validator.extend({
    fieldValueForObject: null
  });
  equals(null, Klass.fieldValueForObject({}, null, null), "should return null") ;
});

test("Calling objectForFieldValue() should not fail if this.prototype.objectForFieldValue() is null", function() {
  var Klass = SC.Validator.extend({
    objectForFieldValue: null
  });
  equals(null, Klass.objectForFieldValue({}, null, null), "should return null") ;
});

plan.run();
