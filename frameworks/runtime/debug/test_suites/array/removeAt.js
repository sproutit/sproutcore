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
  
  Ct.module(T.desc("removeAt"), {
    setup: function() {
      obj = T.newObject();
      observer = T.observer(obj);
    }
  });

  Ct.test("[X].removeAt(0) => [] + notify", function(t) {

    var before = T.expected(1);
    obj.replace(0,0, before);
    observer.observe('[]', 'length') ;
    
    obj.removeAt(0) ;
    T.validateAfter(t, obj, [], observer, true);
  });
  
  Ct.test("[].removeAt(200) => OUT_OF_RANGE_EXCEPTION exception", function(t) {
    var didThrow = false ;
    try {
      obj.removeAt(200);
    } catch (e) {
      t.equal(e, SC.OUT_OF_RANGE_EXCEPTION, 'should throw SC.OUT_OF_RANGE_EXCEPTION');
      didThrow = true ;
    }
    t.ok(didThrow, 'should raise exception');
  });

  Ct.test("[A,B].removeAt(0) => [B] + notify", function(t) {
    var before = T.expected(2), 
        after   = [before[1]];
    
    obj.replace(0,0,before);
    observer.observe('[]', 'length') ;
    
    obj.removeAt(0);
    T.validateAfter(t, obj, after, observer, true);
  });

  Ct.test("[A,B].removeAt(1) => [A] + notify", function(t) {
    var before = T.expected(2), 
        after   = [before[0]];
    
    obj.replace(0,0,before);
    observer.observe('[]', 'length') ;
    
    obj.removeAt(1);
    T.validateAfter(t, obj, after, observer, true);
  });

  Ct.test("[A,B,C].removeAt(1) => [A,C] + notify", function(t) {
    var before = T.expected(3), 
        after   = [before[0], before[2]];
    
    obj.replace(0,0,before);
    observer.observe('[]', 'length') ;
    
    obj.removeAt(1);
    T.validateAfter(t, obj, after, observer, true);
  });
  
  Ct.test("[A,B,C,D].removeAt(1,2) => [A,D] + notify", function(t) {
    var before = T.expected(4), 
        after   = [before[0], before[3]];
    
    obj.replace(0,0,before);
    observer.observe('[]', 'length') ;
    
    obj.removeAt(1,2);
    T.validateAfter(t, obj, after, observer, true);
  });

  Ct.test("[A,B,C,D].removeAt(IndexSet<0,2-3>) => [B] + notify", function(t) {
    var before = T.expected(4), 
        after   = [before[1]];
    
    obj.replace(0,0,before);
    observer.observe('[]', 'length') ;
    
    obj.removeAt(SC.IndexSet.create(0).add(2,2));
    T.validateAfter(t, obj, after, observer, true);
  });
  
});

