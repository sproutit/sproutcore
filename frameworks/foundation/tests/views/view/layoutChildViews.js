// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

// .......................................................
// layoutChildViews() 
// 
module("SC.View#layoutChildViews");

test("calls renderLayout() on child views on views that need layout if they have a layer", function() {

	var callCount = 0 ;
	var ChildView = SC.View.extend({
		updateLayout: function(context) { callCount++; }
	});
	
	var view = SC.View.create({
		childViews: [ChildView, ChildView, ChildView]
	});
	
	var cv1 = view.childViews[0];
	var cv2 = view.childViews[1];
	
	// add to set...
	view.layoutDidChangeFor(cv1);
	view.layoutDidChangeFor(cv2);
	
	view.layoutChildViews();
	equals(callCount, 2, 'updateLayout should be called on two dirty child views');
});

// .......................................................
// updateLayout() 
// 
module("SC.View#updateLayout");

test("if view has layout, calls renderLayout with context to update element", function() {

	// falseTE: renderLayout() is also called when a view's
	// layer is first created.  We use isTesting below to
	// avoid running the renderLayout() test code until we
	// are actually doing layout.
	var callCount = 0, isTesting = false ;
	var view = SC.View.create({
		renderLayout: function(context) {
			if (!isTesting) return ;
			equals(context._elem, this.get('layer'), 'should pass context that will edit layer');
			callCount++;
		}
	});
	
	view.createLayer(); // we need a layer
	ok(view.get('layer'), 'precond - should have a layer');
	
	isTesting= true ;
	view.updateLayout();
	equals(callCount, 1, 'should call renderLayout()');
});

test("if view has false layout, should not call renderLayout", function() {

	// falseTE: renderLayout() is also called when a view's
	// layer is first created.  We use isTesting below to
	// avoid running the renderLayout() test code until we
	// are actually doing layout.
	var callCount = 0, isTesting = false ;
	var view = SC.View.create({
		renderLayout: function(context) {
			if (!isTesting) return ;
			callCount++;
		}
	});
	
	ok(!view.get('layer'), 'precond - should falseT have a layer');
	
	isTesting= true ;
	view.updateLayout();
	equals(callCount, 0, 'should falseT call renderLayout()');
});

test("returns receiver", function() {
	var view = SC.View.create();
	equals(view.updateLayout(), view, 'should return receiver');
});

// .......................................................
//  renderLayout() 
//
module('SC.View#renderLayout');

test("adds layoutStyle property to passed context", function() {

	var view = SC.View.create({
		// mock style for testing...
		layoutStyle: { width: 50, height: 50 } 
	});
	var context = view.renderContext();

	ok(context.styles().width !== 50, 'precond - should falseT have width style');
	ok(context.styles().height !== 50, 'precond - should falseT have height style');


	view.renderLayout(context);

	equals(context.styles().width, 50, 'should have width style');
	equals(context.styles().height, 50, 'should have height style');
});

// .......................................................
// layoutChildViewsIfNeeded() 
//
var view, callCount ;
module('SC.View#layoutChildViewsIfNeeded', {
	setup: function() {
		callCount = 0;
		view = SC.View.create({
			layoutChildViews: function() { callCount++; }
		});
	},
	teardown: function() { view = null; }
});
  
test("calls layoutChildViews() if childViewsNeedLayout and isVisibleInWindow & sets childViewsNeedLayout to false", function() {

	view.childViewsNeedLayout = true ;
	view.isVisibleInWindow = true ;
	view.layoutChildViewsIfNeeded();
	equals(callCount, 1, 'should call layoutChildViews()');
	equals(view.get('childViewsNeedLayout'),false,'should set childViewsNeedLayout to false');
});

test("does not call layoutChildViews() if childViewsNeedLayout is false", function() {

	view.childViewsNeedLayout = false ;
	view.isVisibleInWindow = true ;
	view.layoutChildViewsIfNeeded();
	equals(callCount, 0, 'should falseT call layoutChildViews()');
});


test("does not call layoutChildViews() if isVisibleInWindow is false unless passed isVisible true", function() {

	view.childViewsNeedLayout = true ;
	view.isVisibleInWindow = false ;
	view.layoutChildViewsIfNeeded();
	equals(callCount, 0, 'should falseT call layoutChildViews()');
	equals(view.get('childViewsNeedLayout'), true, 'should leave childViewsNeedLayout set to true');
	
	view.layoutChildViewsIfNeeded(true);
	equals(callCount, 1, 'should call layoutChildViews()');
	equals(view.get('childViewsNeedLayout'), false, 'should set childViewsNeedLayout to false');
});

test("returns receiver", function() {
	equals(view.layoutChildViewsIfNeeded(), view, 'should return receiver');
});
  

plan.run();

