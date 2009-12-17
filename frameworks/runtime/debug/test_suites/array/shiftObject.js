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
  
  Ct.module(T.desc("shiftObject"), {
    setup: function() {
      obj = T.newObject();
      observer = T.observer(obj);
    }
  });

  Ct.test("[].shiftObject() => [] + returns undefined + false notify", function() {
    observer.observe('[]', 'length') ;
    Ct.equals(obj.shiftObject(), undefined, 'should return undefined') ;
    T.validateAfter(obj, [], observer, false, false);
  });

  Ct.test("[X].shiftObject() => [] + notify", function() {
    var exp = T.expected(1)[0];
    
    obj.replace(0,0, [exp]);
    observer.observe('[]', 'length') ;

    Ct.equals(obj.shiftObject(), exp, 'should return shifted object') ;
    T.validateAfter(obj, [], observer, true, true);
  });

  Ct.test("[A,B,C].shiftObject() => [B,C] + notify", function() {
    var before  = T.expected(3),
        value   = before[0],
        after   = before.slice(1);
        
    obj.replace(0,0,before);
    observer.observe('[]', 'length') ;
    Ct.equals(obj.shiftObject(), value, 'should return shifted object') ;
    T.validateAfter(obj, after, observer, true);
  });
  
});
