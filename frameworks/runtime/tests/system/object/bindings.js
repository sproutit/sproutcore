// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

var testObject, fromObject, extraObject, TestObject, TestNamespace;

module("bind() method", {
  
  setup: function() {
    testObject = SC.Object.create({
      foo: "bar",
      bar: "foo",
      extraObject: null 
    });
    
    fromObject = SC.Object.create({
      bar: "foo",
      extraObject: null 
    }) ;
    
    extraObject = SC.Object.create({
      foo: "extraObjectValue"
    }) ;
    
    TestNamespace = {
      fromObject: fromObject,
      testObject: testObject
    } ;
    SC.global('TestNamespace', TestNamespace);
  },
  
  teardown: function() {
    SC.global.remove('TestNamespace');
    testObject = fromObject = extraObject = TestObject = TestNamespace = null;
  }
  
});
  
test("bind(TestNamespace.fromObject.bar) should follow absolute path", function() {
  // create binding
  testObject.bind("foo", "TestNamespace.fromObject.bar") ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  fromObject.set("bar", "changedValue") ;
  
  // support new-style bindings if available
  SC.Binding.flushPendingChanges();
  equals("changedValue", testObject.get("foo"), "testObject.foo");
});
  
test("bind(.bar) should bind to relative path", function() {
  // create binding
  testObject.bind("foo", ".bar") ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  testObject.set("bar", "changedValue") ;
  
  SC.Binding.flushPendingChanges();
  equals("changedValue", testObject.get("foo"), "testObject.foo");
});

test("SC.Binding.bool(TestNamespace.fromObject.bar)) should create binding with bool transform", function() {
  // create binding
  testObject.bind("foo", SC.Binding.bool("TestNamespace.fromObject.bar")) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  fromObject.set("bar", 1) ;
  
  SC.Binding.flushPendingChanges();
  equals(true, testObject.get("foo"), "testObject.foo == true");
  
  fromObject.set("bar", 0) ;
  
  SC.Binding.flushPendingChanges();
  equals(false, testObject.get("foo"), "testObject.foo == false");
});

test("bind(TestNamespace.fromObject*extraObject.foo) should create chained binding", function() {
  testObject.bind("foo", "TestNamespace.fromObject*extraObject.foo");
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  fromObject.set("extraObject", extraObject) ;
  
  SC.Binding.flushPendingChanges();
  equals("extraObjectValue", testObject.get("foo"), "testObject.foo") ;
});

test("bind(*extraObject.foo) should create locally chained binding", function() {
  testObject.bind("foo", "*extraObject.foo");
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  testObject.set("extraObject", extraObject) ;
  
  SC.Binding.flushPendingChanges();
  equals("extraObjectValue", testObject.get("foo"), "testObject.foo") ;
});

test("bind(*extraObject.foo) should be disconnectable", function() {
  var binding = testObject.bind("foo", "*extraObject.foo");
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  binding.disconnect();
  SC.Binding.flushPendingChanges() ;
});

module("fooBinding method", {
  
  setup: function() {
    TestObject = SC.Object.extend({
      foo: "bar",
      bar: "foo",
      extraObject: null 
    });
    
    fromObject = SC.Object.create({
      bar: "foo",
      extraObject: null 
    }) ;
    
    extraObject = SC.Object.create({
      foo: "extraObjectValue"
    }) ;
        
    TestNamespace = {
      fromObject: fromObject,
      testObject: TestObject
    } ;
    SC.global('TestNamespace', TestNamespace); 
  },
  
  teardown: function() { 
    SC.global.remove('TestNamespace');
    testObject = fromObject = extraObject = TestObject = TestNamespace = null;
  }
  
});
 
test("fooBinding: TestNamespace.fromObject.bar should follow absolute path", function() {
  // create binding
  testObject = TestObject.create({
    fooBinding: "TestNamespace.fromObject.bar"
  }) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  fromObject.set("bar", "changedValue") ;
  
  SC.Binding.flushPendingChanges();
  equals("changedValue", testObject.get("foo"), "testObject.foo");
});

test("fooBinding: .bar should bind to relative path", function() {
  
  testObject = TestObject.create({
    fooBinding: ".bar"
  }) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  testObject.set("bar", "changedValue") ;
  
  SC.Binding.flushPendingChanges();
  equals("changedValue", testObject.get("foo"), "testObject.foo");
});

test("fooBinding: SC.Binding.bool(TestNamespace.fromObject.bar should create binding with bool transform", function() {
  
  testObject = TestObject.create({
    fooBinding: SC.Binding.bool("TestNamespace.fromObject.bar") 
  }) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  fromObject.set("bar", 1) ;
  
  SC.Binding.flushPendingChanges();
  equals(true, testObject.get("foo"), "testObject.foo == true");
  
  fromObject.set("bar", 0) ;
  
  SC.Binding.flushPendingChanges();
  equals(false, testObject.get("foo"), "testObject.foo == false");
});

test("fooBinding: TestNamespace.fromObject*extraObject.foo should create chained binding", function() {
  
  testObject = TestObject.create({
    fooBinding: "TestNamespace.fromObject*extraObject.foo" 
  }) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  fromObject.set("extraObject", extraObject) ;
  
  SC.Binding.flushPendingChanges();
  equals("extraObjectValue", testObject.get("foo"), "testObject.foo") ;
});

test("fooBinding: *extraObject.foo should create locally chained binding", function() {
  
  testObject = TestObject.create({
    fooBinding: "*extraObject.foo" 
  }) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  testObject.set("extraObject", extraObject) ;
  
  SC.Binding.flushPendingChanges();
  equals("extraObjectValue", testObject.get("foo"), "testObject.foo") ;
});

module("fooBindingDefault: SC.Binding.Bool (old style)", {
  
  setup: function() {
    TestObject = SC.Object.extend({
      foo: "bar",
      fooBindingDefault: SC.Binding.bool(),
      bar: "foo",
      extraObject: null 
    });
    
    fromObject = SC.Object.create({
      bar: "foo",
      extraObject: null 
    }) ;
    
    TestNamespace = {
      fromObject: fromObject,
      testObject: TestObject
    } ;
    SC.global('TestNamespace', TestNamespace);
  },
  
  teardown: function() { 
    SC.global.remove('TestNamespace');
    testObject = fromObject = extraObject = TestObject = TestNamespace = null;
  }
  
});

test("fooBinding: TestNamespace.fromObject.bar should have bool binding", function() {
  // create binding
  testObject = TestObject.create({
    fooBinding: "TestNamespace.fromObject.bar"
  }) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  fromObject.set("bar", 1) ;
  
  SC.Binding.flushPendingChanges();
  equals(true, testObject.get("foo"), "testObject.foo == true");
  
  fromObject.set("bar", 0) ;
  
  SC.Binding.flushPendingChanges();
  equals(false, testObject.get("foo"), "testObject.foo == false");
});

test("fooBinding: SC.Binding.not(TestNamespace.fromObject.bar should override default", function() {
  
  testObject = TestObject.create({
    fooBinding: SC.Binding.not("TestNamespace.fromObject.bar") 
  }) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  fromObject.set("bar", 1) ;
  
  SC.Binding.flushPendingChanges();
  equals(false, testObject.get("foo"), "testObject.foo == false");
  
  fromObject.set("bar", 0) ;
  
  SC.Binding.flushPendingChanges();
  equals(true, testObject.get("foo"), "testObject.foo == true");
});

module("fooBindingDefault: SC.Binding.bool() (new style)", {
  
  setup: function() {
    TestObject = SC.Object.extend({
      foo: "bar",
      fooBindingDefault: SC.Binding.bool(),
      bar: "foo",
      extraObject: null 
    });
    
    fromObject = SC.Object.create({
      bar: "foo",
      extraObject: null 
    }) ;
    
    TestNamespace = {
      fromObject: fromObject,
      testObject: testObject
    } ;
    SC.global('TestNamespace', TestNamespace);
  },
  
  teardown: function() { 
    SC.global.remove('TestNamespace');
    testObject = fromObject = extraObject = TestObject = TestNamespace = null;
  }
  
});

test("fooBinding: TestNamespace.fromObject.bar should have bool binding", function() {
  // create binding
  testObject = TestObject.create({
    fooBinding: "TestNamespace.fromObject.bar"
  }) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  fromObject.set("bar", 1) ;
  
  SC.Binding.flushPendingChanges();
  equals(true, testObject.get("foo"), "testObject.foo == true");
  
  fromObject.set("bar", 0) ;
  
  SC.Binding.flushPendingChanges();
  equals(false, testObject.get("foo"), "testObject.foo == false");
});

test("fooBinding: SC.Binding.not(TestNamespace.fromObject.bar should override default", function() {
  
  testObject = TestObject.create({
    fooBinding: SC.Binding.not("TestNamespace.fromObject.bar") 
  }) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  fromObject.set("bar", 1) ;
  
  SC.Binding.flushPendingChanges();
  equals(false, testObject.get("foo"), "testObject.foo == false");
  
  fromObject.set("bar", 0) ;
  
  SC.Binding.flushPendingChanges();
  equals(true, testObject.get("foo"), "testObject.foo == true");
});

test("Chained binding should be null if intermediate object in chain is null", function() {
  var a, z;
  
  a = SC.Object.create({
    b: SC.Object.create({
      c: 'c'
    }),
    zBinding: '*b.c'
  });
  
  SC.Binding.flushPendingChanges();
  equals(a.get('z'), 'c', "a.z == 'c'");
    
  a.set('b', null);
  SC.Binding.flushPendingChanges();
  equals(a.get('z'), null, "a.z == null");
});

plan.run();
