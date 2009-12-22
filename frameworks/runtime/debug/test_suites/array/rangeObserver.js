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
  
  var expected, array, observer, rangeObserver ;

  // ..........................................................
  // MODULE: isDeep = true 
  // 
  Ct.module(T.desc("RangeObserver Methods"), {
    setup: function() {
      expected = T.objects(10);
      array = T.newObject(expected);

      observer = T.observer();
      rangeObserver = array.addRangeObserver(SC.IndexSet.create(2,3), 
                observer, observer.rangeDidChange, null, false);
      
    },
    
    teardown: function() {
      T.destroyObject(array);
    }
  });
  
  Ct.test("returns RangeObserver object", function() {
    Ct.ok(rangeObserver && rangeObserver.isRangeObserver, 'returns a range observer object');
  });

  // NOTE: Deep Property Observing is disabled for SproutCore 1.0
  //
  // // ..........................................................
  // // EDIT PROPERTIES
  // // 
  //
  // Ct.test("editing property on object in range should fire observer", function() {
  //   var obj = array.objectAt(3);
  //   obj.set('foo', 'BAR');
  //   observer.expectRangeChange(array, obj, 'foo', SC.IndexSet.create(3));
  // });
  // 
  // Ct.test("editing property on object outside of range should NOT fire observer", function() {
  //   var obj = array.objectAt(0);
  //   obj.set('foo', 'BAR');
  //   Ct.equals(observer.callCount, 0, 'observer should not fire');
  // });
  // 
  // 
  // Ct.test("updating property after changing observer range", function() {
  //   array.updateRangeObserver(rangeObserver, SC.IndexSet.create(8,2));
  //   observer.callCount = 0 ;// reset b/c callback should happen here
  // 
  //   var obj = array.objectAt(3);
  //   obj.set('foo', 'BAR');
  //   Ct.equals(observer.callCount, 0, 'modifying object in old range should not fire observer');
  //   
  //   obj = array.objectAt(9);
  //   obj.set('foo', 'BAR');
  //   observer.expectRangeChange(array, obj, 'foo', SC.IndexSet.create(9));
  //   
  // });
  // 
  // Ct.test("updating a property after removing an range should not longer update", function() {
  //   array.removeRangeObserver(rangeObserver);
  // 
  //   observer.callCount = 0 ;// reset b/c callback should happen here
  // 
  //   var obj = array.objectAt(3);
  //   obj.set('foo', 'BAR');
  //   Ct.equals(observer.callCount, 0, 'modifying object in old range should not fire observer');
  //   
  // });

  // ..........................................................
  // REPLACE
  // 

  Ct.test("replacing object in range fires observer with index set covering only the effected item", function() {
    array.replace(2, 1, T.objects(1));
    observer.expectRangeChange(array, null, '[]', SC.IndexSet.create(2,1));
  });

  Ct.test("replacing object before range", function() {
    array.replace(0, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');
  });

  Ct.test("replacing object after range", function() {
    array.replace(9, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');
  });

  Ct.test("updating range should be reflected by replace operations", function() {
    array.updateRangeObserver(rangeObserver, SC.IndexSet.create(9,1));
    
    observer.callCount = 0 ;
    array.replace(2, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');

    observer.callCount = 0 ;
    array.replace(0, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');

    observer.callCount = 0 ;
    array.replace(9, 1, T.objects(1));
    observer.expectRangeChange(array, null, '[]', SC.IndexSet.create(9));
  });

  Ct.test("removing range should no longer fire observers", function() {
    array.removeRangeObserver(rangeObserver);
    
    observer.callCount = 0 ;
    array.replace(2, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');

    observer.callCount = 0 ;
    array.replace(0, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');

    observer.callCount = 0 ;
    array.replace(9, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');
  });

  // ..........................................................
  // GROUPED CHANGES
  // 
  
  Ct.test("grouping property changes should notify observer only once at end with single IndexSet", function() {
    
    array.beginPropertyChanges();
    array.replace(2, 1, T.objects(1));
    array.replace(4, 1, T.objects(1));
    array.endPropertyChanges();
    
    var set = SC.IndexSet.create().add(2).add(4); // both edits
    observer.expectRangeChange(array, null, '[]', set);
  });

  Ct.test("should notify observer when some but not all grouped changes are inside range", function() {
    
    array.beginPropertyChanges();
    array.replace(2, 1, T.objects(1));
    array.replace(9, 1, T.objects(1));
    array.endPropertyChanges();
    
    var set = SC.IndexSet.create().add(2).add(9); // both edits
    observer.expectRangeChange(array, null, '[]', set);
  });
  
  Ct.test("should NOT notify observer when grouping changes all outside of observer", function() {
    
    array.beginPropertyChanges();
    array.replace(0, 1, T.objects(1));
    array.replace(9, 1, T.objects(1));
    array.endPropertyChanges();

    Ct.equals(observer.callCount, 0, 'observer should not fire');
  });
  
  // ..........................................................
  // INSERTING
  // 
  
  Ct.test("insertAt in range fires observer with index set covering edit to end of array", function() {
    var newItem = T.objects(1)[0],
        set     = SC.IndexSet.create(3,array.get('length')-2);
        
    array.insertAt(3, newItem);
    observer.expectRangeChange(array, null, '[]', set);
  });

  Ct.test("insertAt BEFORE range fires observer with index set covering edit to end of array", function() {
    var newItem = T.objects(1)[0],
        set     = SC.IndexSet.create(0,array.get('length')+1);
        
    array.insertAt(0, newItem);
    observer.expectRangeChange(array, null, '[]', set);
  });

  Ct.test("insertAt AFTER range does not fire observer", function() {
    var newItem = T.objects(1)[0];
        
    array.insertAt(9, newItem);
    Ct.equals(observer.callCount, 0, 'observer should not fire');
  });
  
  // ..........................................................
  // REMOVING
  // 
  
  Ct.test("removeAt IN range fires observer with index set covering edit to end of array plus delta", function() {
    var set     = SC.IndexSet.create(3,array.get('length')-3);
    array.removeAt(3);
    observer.expectRangeChange(array, null, '[]', set);
  });

  Ct.test("removeAt BEFORE range fires observer with index set covering edit to end of array plus delta", function() {
    var set     = SC.IndexSet.create(0,array.get('length'));
    array.removeAt(0);
    observer.expectRangeChange(array, null, '[]', set);
  });

  Ct.test("removeAt AFTER range does not fire observer", function() {
    array.removeAt(9);
    Ct.equals(observer.callCount, 0, 'observer should not fire');
  });
  
  
  
  
  // ..........................................................
  // MODULE: No explicit range
  // 
  Ct.module(T.desc("RangeObserver Methods - No explicit range"), {
    setup: function() {
      expected = T.objects(10);
      array = T.newObject(expected);

      observer = T.observer();
      rangeObserver = array.addRangeObserver(null, observer, 
                          observer.rangeDidChange, null, false);
      
    },
    
    teardown: function() {
      T.destroyObject(array);
    }
  });
  
  Ct.test("returns RangeObserver object", function() {
    Ct.ok(rangeObserver && rangeObserver.isRangeObserver, 'returns a range observer object');
  });

  // ..........................................................
  // REPLACE
  // 

  Ct.test("replacing object in range fires observer with index set covering only the effected item", function() {
    array.replace(2, 1, T.objects(1));
    observer.expectRangeChange(array, null, '[]', SC.IndexSet.create(2,1));
  });

  Ct.test("replacing at start of array", function() {
    array.replace(0, 1, T.objects(1));
    observer.expectRangeChange(array, null, '[]', SC.IndexSet.create(0,1));
  });

  Ct.test("replacing object at end of array", function() {
    array.replace(9, 1, T.objects(1));
    observer.expectRangeChange(array, null, '[]', SC.IndexSet.create(9,1));
  });

  Ct.test("removing range should no longer fire observers", function() {
    array.removeRangeObserver(rangeObserver);
    
    observer.callCount = 0 ;
    array.replace(2, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');

    observer.callCount = 0 ;
    array.replace(0, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');

    observer.callCount = 0 ;
    array.replace(9, 1, T.objects(1));
    Ct.equals(observer.callCount, 0, 'observer should not fire');
  });

  // ..........................................................
  // GROUPED CHANGES
  // 
  
  Ct.test("grouping property changes should notify observer only once at end with single IndexSet", function() {
    
    array.beginPropertyChanges();
    array.replace(2, 1, T.objects(1));
    array.replace(4, 1, T.objects(1));
    array.endPropertyChanges();
    
    var set = SC.IndexSet.create().add(2).add(4); // both edits
    observer.expectRangeChange(array, null, '[]', set);
  });

  // ..........................................................
  // INSERTING
  // 
  
  Ct.test("insertAt in range fires observer with index set covering edit to end of array", function() {
    var newItem = T.objects(1)[0],
        set     = SC.IndexSet.create(3,array.get('length')-2);
        
    array.insertAt(3, newItem);
    observer.expectRangeChange(array, null, '[]', set);
  });

  Ct.test("adding object fires observer", function() {
    var newItem = T.objects(1)[0];
    var set = SC.IndexSet.create(array.get('length'));

    array.pushObject(newItem);
    observer.expectRangeChange(array, null, '[]', set);
  });
  
  // ..........................................................
  // REMOVING
  // 
  
  Ct.test("removeAt fires observer with index set covering edit to end of array", function() {
    var set     = SC.IndexSet.create(3,array.get('length')-3);
    array.removeAt(3);
    observer.expectRangeChange(array, null, '[]', set);
  });

  Ct.test("popObject fires observer with index set covering removed range", function() {
    var set = SC.IndexSet.create(array.get('length')-1);
    array.popObject();
    observer.expectRangeChange(array, null, '[]', set);
  });
  
  
  // ..........................................................
  // MODULE: isDeep = false 
  // 
  Ct.module(T.desc("RangeObserver Methods - isDeep false"), {
    setup: function() {
      expected = T.objects(10);
      array = T.newObject(expected);

      observer = T.observer();
      rangeObserver = array.addRangeObserver(SC.IndexSet.create(2,3), 
                observer, observer.rangeDidChange, null, false);
      
    },
    
    teardown: function() {
      T.destroyObject(array);
    }
  });
  
  Ct.test("editing property on object at any point should not fire observer", function() {
    
    var indexes = [0,3,9], 
        loc     = 3,
        obj,idx;
        
    while(--loc>=0) {
      idx = indexes[loc];
      obj = array.objectAt(idx);
      obj.set('foo', 'BAR');
      Ct.equals(observer.callCount, 0, 'observer should not fire when editing object at index %@'.fmt(idx));
    }
  });
  
  Ct.test("replacing object in range fires observer with index set", function() {
    array.replace(2, 1, T.objects(1));
    observer.expectRangeChange(array, null, '[]', SC.IndexSet.create(2,1));
  });
    
  
});

