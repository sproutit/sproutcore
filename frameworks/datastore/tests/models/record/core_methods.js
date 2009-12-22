// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index');

var MyApp, dataSource;
module("SC.Record core methods", {
  setup: function() {
    dataSource = SC.DataSource.create({ 
      
      gotParams: false,
      wasCommitted: false,
      
      createRecord: function(store, storeKey, params) {
        this.wasCommitted = true;
        this.gotParams = params && params['param1'] ? true: false;
      }});
    
    MyApp = SC.Object.create({
      store: SC.Store.create().from(dataSource)
    })  ;
  
    MyApp.Foo = SC.Record.extend({});
    MyApp.json = { 
      foo: "bar", 
      number: 123,
      bool: true,
      array: [1,2,3],
      guid: 1
    };
    
    SC.RunLoop.begin();
    MyApp.foo = MyApp.store.createRecord(MyApp.Foo, MyApp.json);
    SC.RunLoop.end();
    
  }
});

test("statusString", function() {
  equals(MyApp.foo.statusString(), 'READY_NEW', 'status string should be READY_NEW');
});

test("Can commitRecord() specific SC.Record instance", function() {
  
  MyApp.foo.set('foo', 'foobar');
  
  // commit the new record
  MyApp.foo.commitRecord({ param1: 'value1' });
  
  equals(dataSource.wasCommitted, true, 'Record was committed');
  equals(dataSource.gotParams, true, 'Params were properly passed through commitRecord');
  
});

plan.run();
