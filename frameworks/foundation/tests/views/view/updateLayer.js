// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

// falseTE: This file tests both updateLayer() and the related methods that 
// will trigger it.

// ..........................................................
// TEST: updateLayer()
// 
module("SC.View#updateLayer");

test("invokes prepareContext() and then updates layer element", function() {
  var layer = document.createElement('div');
  var view = SC.View.create({
    layer: layer, // fake it...
    prepareContext: function(context) {
      context.addClass('did-update');
    }
  });
  
  view.updateLayer();
  ok(SC.$(layer).attr('class').indexOf('did-update')>=0, 'has class name added by prepareContext()');
});

// ..........................................................
// TEST: updateLayerIfNeeded()
// 
var view, callCount ;
module("SC.View#updateLayerIfNeeded", {
  setup: function() {
    // setup a fake view class so that updateLayerIfNeeded() will call
    // updateLayer() if needed.  updateLayer() is faked to isolate test
    var layer = document.createElement('div');
    view = SC.View.create({
      layer: layer, // fake it...
      isVisibleInWindow: true,
      layerNeedsUpdate: true,
      updateLayer: function() { callCount++; }
    });
    callCount = 0 ;
  }
  
});

test("does not call updateLayer if layerNeedsUpdate is false", function() {
  view.set('layerNeedsUpdate', false);
  view.updateLayerIfNeeded();
  equals(callCount, 0, 'updateLayer did falseT run');
});

test("does not call updateLayer if isVisibleInWindow is false", function() {
  view.set('isVisibleInWindow', false);
  view.updateLayerIfNeeded();
  equals(callCount, 0, 'updateLayer did falseT run');
});

test("does call updateLayer() if isVisible & layerNeedsUpdate", function() {
  equals(view.get('isVisibleInWindow'), true, 'precond - isVisibleInWindow');
  equals(view.get('layerNeedsUpdate'), true, 'precond - layerNeedsUpdate');
  
  view.updateLayerIfNeeded();
  ok(callCount > 0, 'updateLayer() did run');
});

test("resets layerNeedsUpdate to false if called", function() {
  equals(view.get('layerNeedsUpdate'), true, 'precond - layerNeedsUpdate');
  view.updateLayerIfNeeded();
  equals(view.get('layerNeedsUpdate'), false, 'layerNeedsUpdate reset to false');
});

test("returns receiver", function() {
  equals(view.updateLayerIfNeeded(), view, 'returns receiver');
});

test("only runs updateLayer() once if called multiple times (since layerNeedsUpdate is set to false)", function() {
  callCount = 0;
  view.updateLayerIfNeeded().updateLayerIfNeeded().updateLayerIfNeeded();
  equals(callCount, 1, 'updateLayer() called only once');
});

// ..........................................................
// TEST: layerNeedsUpdate auto-trigger
// 
module("SC.View#layerNeedsUpdate auto-triggers", {
  setup: function() {
    // use fake method to isolate call...
    view = SC.View.create({
      updateLayerIfNeeded: function() { callCount++; }
    });
    callCount = 0;
  }
});

test("setting layerNeedsUpdate calls updateLayerIfNeeded at end of runloop", function() {
  SC.RunLoop.begin();
  view.set('layerNeedsUpdate', true);
  SC.RunLoop.end();
  
  equals(callCount, 1, 'updateLayerIfNeeded did run');  
});

test("setting & resetting only triggers updateLayerIfNeeded once per runloop", function() {
  SC.RunLoop.begin();
  view.set('layerNeedsUpdate', true)
      .set('layerNeedsUpdate', false)
      .set('layerNeedsUpdate', true);
  SC.RunLoop.end();
  
  equals(callCount, 1, 'updateLayerIfNeeded did run');  
});

// ..........................................................
// INTEGRATION SCENARIOS
// 

module("SC.View#updateLayer - integration");

test("layerNeedsUpdate actually triggers updateLayer", function() {
  var callCount = 0 ;
  var layer = document.createElement('div');
  var view = SC.View.create({
    layer: layer, // fake it...
    isVisibleInWindow: true,
    updateLayer: function() { callCount++; }
  });
  
  SC.RunLoop.begin();
  view.set('layerNeedsUpdate', true);
  SC.RunLoop.end();
  
  equals(callCount, 1, 'updateLayer did run b/c layerNeedsUpdate is true');
  callCount = 0 ;
  
  SC.RunLoop.begin();
  view.set('layerNeedsUpdate', true);
  view.set('layerNeedsUpdate', false);
  SC.RunLoop.end();
  
  equals(callCount, 0, 'updateLayer did falseT run b/c layerNeedsUpdate is false');
});


plan.run();
