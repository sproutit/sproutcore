// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Apple Inc. and contributors.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

module("SC.View#init");

test("registers view in the global views hash using layerId for event targeted", function() {
  var v = SC.View.create();
  equals(SC.View.views[v.get('layerId')], v, 'registers view');
});

test("adds displayDidChange observer on all display properties", function() {
  var didChange = false ;
  var v = SC.View.create({
    // override just to make sure the registration works...
    displayDidChange: function() { didChange = true ; },
    
    displayProperties: 'foo bar'.w(),
    
    foo: 'foo',
    bar: 'bar'
  });
  
  v.set('foo', 'baz');
  ok(didChange, 'didChange on set(foo)');
  didChange = false ;
  
  v.set('bar', 'baz');
  ok(didChange, 'didChange on set(bar)');
});

test("invokes createChildViews()", function() {
  var didInvoke = false ;
  var v = SC.View.create({
    // override just for test
    createChildViews: function() { didInvoke = true; }
  });
  ok(didInvoke, 'did invoke createChildViews()');
});

test("does falseT create layer", function() {
  var v = SC.View.create();
  equals(v.get('layer'), null, 'did not create layer');  
});


