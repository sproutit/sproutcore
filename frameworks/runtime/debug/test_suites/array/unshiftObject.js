// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var SC = require('core'),
    Ct = require('index', 'core_test');
require('debug/test_suites/array/base');

SC.ArraySuite.define(function(T) {
  
  var observer, obj ;
  
  Ct.module(T.desc("unshiftObject"), {
    setup: function() {
      obj = T.newObject();
      observer = T.observer(obj);
    }
  });

  Ct.test("returns unshifted object", function(t) {
    var exp = T.expected(1)[0];
    t.equal(obj.pushObject(exp), exp, 'should return receiver');
  });
  

  Ct.test("[].unshiftObject(X) => [X] + notify", function(t) {
    var exp = T.expected(1);
    observer.observe('[]', 'length') ;
    obj.unshiftObject(exp[0]) ;
    T.validateAfter(t, obj, exp, observer, true);
  });

  Ct.test("[A,B,C].unshiftObject(X) => [X,A,B,C] + notify", function(t) {
    var after  = T.expected(4),
        before = after.slice(1),
        value  = after[0];
        
    obj.replace(0,0,before);
    observer.observe('[]', 'length') ;
    obj.unshiftObject(value) ;
    T.validateAfter(t, obj, after, observer, true);
  });
  
});
