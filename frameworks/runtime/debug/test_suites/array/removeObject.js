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
  
  Ct.module(T.desc("removeObject"), {
    setup: function() {
      obj = T.newObject();
      observer = T.observer(obj);
    }
  });

  Ct.test("should return receiver", function() {
    obj = T.newObject(3);
    Ct.equals(obj.removeObject(obj.objectAt(0)), obj, 'should return receiver');
  });
  
  Ct.test("[A,B,C].removeObject(B) => [A,C] + notify", function() {

    var before = T.expected(3),
        after  = [before[0], before[2]];
    obj.replace(0,0, before);
    observer.observe('[]', 'length') ;
    
    obj.removeObject(before[1]) ;
    T.validateAfter(obj, after, observer, true);
  });
  
  Ct.test("[A,B,C].removeObject(D) => [A,B,C]", function() {
    var exp = T.expected(4),
        extra = exp.pop();
    obj.replace(0,0,exp);
    observer.observe('[]', 'length') ;
    
    obj.removeObject(extra);
    T.validateAfter(obj, exp, observer, false, false);
  });
  
});
