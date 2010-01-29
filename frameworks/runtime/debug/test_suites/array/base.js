// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var SC = require('core'),
    Ct = require('core_test');

/**
  Adds a new module of unit tests to verify that the passed object implements
  the SC.Array interface.  To generate, call the ArrayTests array with a 
  test descriptor.  Any properties you pass will be applied to the ArrayTests
  descendent created by the create method.
  
  You should pass at least a newObject() method, which should return a new 
  instance of the object you want to have tested.  You can also implement the
  destroyObject() method, which should destroy a passed object.
  
  {{{
    SC.ArrayTests.generate("Array", {
      newObject:  function() { return []; }
    });
  }}}
  
  newObject must accept an optional array indicating the number of items
  that should be in the array.  You should initialize the the item with 
  that many items.  The actual objects you add are up to you.
  
  Unit tests themselves can be added by calling the define() method.  The
  function you pass will be invoked whenever the ArrayTests are generated. The
  parameter passed will be the instance of ArrayTests you should work with.
  
  {{{
    SC.ArrayTests.define(function(T) {
      T.module("length");
      
      test("verify length", function() {
        var ary = T.newObject();
        equals(ary.get('length'), 0, 'should have 0 initial length');
      });
    }
  }}}
  
  
*/
SC.ArraySuite = Ct.Suite.create("Verify SC.Array compliance: %@#%@", {
  
  /** 
    Override to return a set of simple values such as numbers or strings.
    Return null if your set does not support primitives.
  */
  simple: function(amt) {
    var ret = [];
    if (amt === undefined) amt = 0;
    while(--amt >= 0) ret[amt] = amt ;
    return ret ;
  },

  /**  Override with the name of the key we should get/set on hashes */
  hashValueKey: 'foo',
  
  /**
    Override to return hashes of values if supported.  Or return null.
  */
  hashes: function(amt) {
    var ret = [];  
    if (amt === undefined) amt = 0;
    while(--amt >= 0) {
      ret[amt] = {};
      ret[amt][this.hashValueKey] = amt ;
    }
    return ret ;
  },
  
  /** Override with the name of the key we should get/set on objects */
  objectValueKey: "foo",
  
  /**
    Override to return observable objects if supported.  Or return null.
  */
  objects: function(amt) {
    var ret = [];  
    if (amt === undefined) amt = 0;
    while(--amt >= 0) {
      var o = {};
      o[this.objectValueKey] = amt ;
      ret[amt] = SC.Object.create(o);
    }
    return ret ;
  },

  /**
    Returns an array of content items in your preferred format.  This will
    be used whenever the test does not care about the specific object content.
  */
  expected: function(amt) {
    return this.simple(amt);
  },
  
  /**
    Example of how to implement newObject
  */
  newObject: function(expected) {
    if (!expected || SC.typeOf(expected) === SC.T_NUMBER) {
      expected = this.expected(expected);
    }
    
    return expected.slice();
  },
  
  
  /**
    Creates an observer object for use when tracking object modifications.
  */
  observer: function(obj) {
    return SC.Object.create({

      // ..........................................................
      // NORMAL OBSERVER TESTING
      // 
      
      observer: function(target, key, value) {
        this.notified[key] = true ;
        this.notifiedValue[key] = value ;
      },

      resetObservers: function() {
        this.notified = {} ;
        this.notifiedValue = {} ;
      },

      observe: function() {
        var keys = SC.$A(arguments) ;
        var loc = keys.length ;
        while(--loc >= 0) {
          obj.addObserver(keys[loc], this, this.observer) ;
        }
        return this ;
      },

      didNotify: function(key) {
        return !!this.notified[key] ;
      },

      init: function() {
        sc_super() ;
        this.resetObservers() ;
      },
      
      // ..........................................................
      // RANGE OBSERVER TESTING
      // 
      
      callCount: 0,

      // call afterward to verify
      expectRangeChange: function(t, source, object, key, indexes, context) {
        t.equal(this.callCount, 1, 'expects one callback');
        
        if (source !== undefined && source !== false) {
          t.ok(this.source, source, 'source should equal array');
        }
        
        if (object !== undefined && object !== false) {
          t.equal(this.object, object, 'object');
        }
        
        if (key !== undefined && key !== false) {
          t.equal(this.key, key, 'key');
        }
        
        if (indexes !== undefined && indexes !== false) {
          if (indexes.isIndexSet) {
            t.ok(this.indexes && this.indexes.isIndexSet, 'indexes should be index set');
            t.ok(indexes.isEqual(this.indexes), 'indexes should match %@ (actual: %@)'.fmt(indexes, this.indexes));
          } else t.equal(this.indexes, indexes, 'indexes');
        }
          
        if (context !== undefined && context !== false) {
          t.equal(this.context, context, 'context should match');
        }
        
      },
      
      rangeDidChange: function(source, object, key, indexes, context) {
        this.callCount++ ;
        this.source = source ;
        this.object = object ;
        this.key    = key ;
        
        // clone this because the index set may be reused after this callback
        // runs.
        this.indexes = (indexes && indexes.isIndexSet) ? indexes.clone() : indexes;
        this.context = context ;          
      }
      
    });  
  },
  
  /**
    Verifies that the passed object matches the passed array.
  */
  validateAfter: function(t, obj, after, observer, lengthDidChange, enumerableDidChange) {
    var loc = after.length;
    t.equal(obj.get('length'), loc, 'length should update (%@)'.fmt(obj)) ;
    while(--loc >= 0) {
      t.equal(obj.objectAt(loc), after[loc], 'objectAt(%@)'.fmt(loc)) ;
    }

    // note: we only test that the length notification happens when we expect
    // it.  If we don't expect a length notification, it is OK for a class
    // to trigger a change anyway so we don't check for this case.
    if (enumerableDidChange !== false) {
      t.equal(observer.didNotify("[]"), true, 'should notify []') ;
    }
    
    if (lengthDidChange) {
      t.equal(observer.didNotify('length'), true, 'should notify length change');
    }
  }
  
});

// Simple verfication of length
SC.ArraySuite.define(function(T) {
  T.module("length");
  
  Ct.test("should return 0 on empty array", function(t) {
    t.equal(T.object.get('length'), 0, 'should have empty length');
  });
  
  Ct.test("should return array length", function(t) {
    var obj = T.newObject(3);
    t.equal(obj.get('length'), 3, 'should return length');
  });
  
});
