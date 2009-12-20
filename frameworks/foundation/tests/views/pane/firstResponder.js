// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

var pane, r, view0, view1 ;
CommonSetup = {
  setup: function() {
    pane = SC.Pane.create({
      childViews: [SC.View, SC.View]
    });
    view0 = pane.childViews[0];
    view1 = pane.childViews[1];
    
    pane.append(); // make visible so it will have root responder
    r = pane.get('rootResponder');
    ok(r, 'has root responder');
  },
  teardown: function() {
    pane.remove();
    pane = r = view0 = view1 = null ;
  }
};

// ..........................................................
// makeFirstResponder()
// 
module("SC.Pane#makeFirstResponder", CommonSetup);

test("make firstResponder from null, not keyPane", function() {
  var okCount = 0, badCount = 0;
  view0.didBecomeFirstResponder = function() { okCount ++; };
  
  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
    function() { badCount ++; };
    
  pane.makeFirstResponder(view0);
  equals(okCount, 1, 'should invoke didBecomeFirstResponder callbacks');
  equals(badCount, 0, 'should not invoke ..BecomeKeyResponder callbacks');
  
  equals(pane.get('firstResponder'), view0, 'should set firstResponder to view');
  
  ok(view0.get('isFirstResponder'), 'should set view.isFirstResponder to true');
  ok(!view0.get('isKeyResponder'), 'should not set view.isKeyResponder');
});


test("make firstResponder from null, is keyPane", function() {
  var okCount = 0 ;
  view0.didBecomeFirstResponder = 
  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
    function() { okCount++; };

  pane.becomeKeyPane();
  pane.makeFirstResponder(view0);
  equals(okCount, 3, 'should invoke didBecomeFirstResponder + KeyResponder callbacks');
  
  equals(pane.get('firstResponder'), view0, 'should set firstResponder to view');
  
  ok(view0.get('isFirstResponder'), 'should set view.isFirstResponder to true');
  ok(view0.get('isKeyResponder'), 'should set view.isKeyResponder');
});


test("make firstResponder from other view, not keyPane", function() {
  
  // preliminary setup
  pane.makeFirstResponder(view1);
  equals(pane.get('firstResponder'), view1, 'precond - view1 is firstResponder');
  
  var okCount = 0, badCount = 0;
  view0.didBecomeFirstResponder = function() { okCount ++; };
  view1.willLoseFirstResponder = function() { okCount ++; };
  
  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
    function() { badCount ++; };
  view1.willLoseKeyResponderTo = view0.didLoseKeyResponderTo =
    function() { badCount ++; };
    
  pane.makeFirstResponder(view0);
  equals(okCount, 2, 'should invoke ..BecomeFirstResponder callbacks');
  equals(badCount, 0, 'should not invoke ..BecomeKeyResponder callbacks');
  
  equals(pane.get('firstResponder'), view0, 'should set firstResponder to view');
  
  ok(view0.get('isFirstResponder'), 'should set view.isFirstResponder to true');
  ok(!view0.get('isKeyResponder'), 'should not set view.isKeyResponder');
  
  ok(!view1.get('isFirstResponder'), 'view1.isFirstResponder should now be set to false');
  
});


test("make firstResponder from other view, as keyPane", function() {
  
  // preliminary setup
  pane.becomeKeyPane();
  pane.makeFirstResponder(view1);
  equals(pane.get('firstResponder'), view1, 'precond - view1 is firstResponder');
  ok(view1.get('isFirstResponder'), 'precond - view1.isFirstResponder should be true');
  ok(view1.get('isKeyResponder'), 'precond - view1.isFirstResponder should be true');
  
  var okCount = 0 ;
  view0.didBecomeFirstResponder = view1.willLoseFirstResponder = 
  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
  view1.willLoseKeyResponderTo = view1.didLoseKeyResponderTo =
    function() { okCount ++; };
    
  pane.makeFirstResponder(view0);
  equals(okCount, 6, 'should invoke FirstResponder + KeyResponder callbacks on both views');
  
  equals(pane.get('firstResponder'), view0, 'should set firstResponder to view');
  
  ok(view0.get('isFirstResponder'), 'should set view.isFirstResponder to true');
  ok(view0.get('isKeyResponder'), 'should set view.isKeyResponder');
  
  ok(!view1.get('isFirstResponder'), 'view1.isFirstResponder should now be set to false');
  ok(!view1.get('isKeyResponder'), 'view1.isFirstResponder should now be set to false');
  
});


test("makeFirstResponder(view) when view is already first responder", function() {
  
  // preliminary setup
  pane.becomeKeyPane();
  pane.makeFirstResponder(view0);
  equals(pane.get('firstResponder'), view0, 'precond - view0 is firstResponder');
  ok(view0.get('isFirstResponder'), 'precond - view0.isFirstResponder should be true');
  ok(view0.get('isKeyResponder'), 'precond - view0.isFirstResponder should be true');
  
  var callCount = 0 ;
  view0.didBecomeFirstResponder = view0.willLoseFirstResponder = 
  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
  view0.willLoseKeyResponderTo = view0.didLoseKeyResponderTo =
    function() { callCount ++; };
    
  pane.makeFirstResponder(view0);
  equals(callCount, 0, 'should invoke no FirstResponder + KeyResponder callbacks on view');
  
  equals(pane.get('firstResponder'), view0, 'should keep firstResponder to view');
  ok(view0.get('isFirstResponder'), 'should keep view.isFirstResponder to true');
  ok(view0.get('isKeyResponder'), 'should keep view.isKeyResponder');
  
});

plan.run();
