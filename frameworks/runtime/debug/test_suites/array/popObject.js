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
  
  Ct.module(T.desc("popObject"), {
    setup: function() {
      obj = T.newObject();
      observer = T.observer(obj);
    }
  });

  Ct.test("[].popObject() => [] + returns undefined + false notify", function() {
    observer.observe('[]', 'length') ;
    Ct.equals(obj.popObject(), undefined, 'should return undefined') ;
    T.validateAfter(obj, [], observer, false, false);
  });

  Ct.test("[X].popObject() => [] + notify", function() {
    var exp = T.expected(1)[0];
    
    obj.replace(0,0, [exp]);
    observer.observe('[]', 'length') ;

    Ct.equals(obj.popObject(), exp, 'should return popped object') ;
    T.validateAfter(obj, [], observer, true, true);
  });

  Ct.test("[A,B,C].popObject() => [A,B] + notify", function() {
    var before  = T.expected(3),
        value   = before[2],
        after   = before.slice(0,2);
        
    obj.replace(0,0,before);
    observer.observe('[]', 'length') ;
    Ct.equals(obj.popObject(), value, 'should return popped object') ;
    T.validateAfter(obj, after, observer, true);
  });
  
});
