// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Apple Inc. and contributors.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

module("SC.View#prepareContext");

test("populates context with layerId & classNames from view if firstTime", function() {
  var view = SC.View.create({
    layerId: "foo", 
    classNames: ["bar"] 
  });
  var context = view.renderContext();
  
  // test with firstTime
  view.prepareContext(context, true);
  equals(context.id(), 'foo', 'did set id');
  ok(context.hasClass('bar'), 'did set class names');
  
  // test w/o firstTime
  context = view.renderContext();
  view.prepareContext(context, false);
  ok(context.id() !== 'foo', 'did not set id');
  ok(context.hasClass('bar'), 'did set class name');
});

test("invokes renderLayout if first time", function() {
  var runCount = 0;
  var context, isFirstTime ;
  var view = SC.View.create({
    renderLayout: function(aContext, firstTime) { 
    	equals(aContext, context, 'passed context');
    	equals(firstTime, isFirstTime, 'passed firstTime');
    	runCount++; 
    }
  });
  
	// test w/ firstTime
  context = view.renderContext();
  isFirstTime = true ;
	view.prepareContext(context, true);
	equals(runCount, 1, 'should call renderLayout');
	
	// test w/o firstTime
	runCount = 0 ;
  context = view.renderContext();
  isFirstTime = false ;
	view.prepareContext(context, false);
	equals(runCount, 0, 'should not call renderLayout');

});


test("adds text-selectable class if view has isTextSelectable", function() {

  var view = SC.View.create() ;
  var context ;
  
  context = view.renderContext();
  view.set('isTextSelectable', true);
  view.prepareContext(context, true);
  ok(context.hasClass('allow-select'), 'should have text-selectable class');
  
  context = view.renderContext();
  view.set('isTextSelectable', false);
  view.prepareContext(context, true);
  ok(!context.hasClass('allow-select'), 'should falseT have text-selectable class');
  
});

test("adds disabled class if view isEnabled = false", function() {

  var view = SC.View.create() ;
  var context ;
  
  context = view.renderContext();
  view.set('isEnabled', true);
  view.prepareContext(context, true);
  ok(!context.hasClass('disabled'), 'should falseT have disabled class');
  
  context = view.renderContext();
  view.set('isEnabled', false);
  view.prepareContext(context, true);
  ok(context.hasClass('disabled'), 'should have disabled class');
  
});

test("adds hidden class if view isVisible = false", function() {

  var view = SC.View.create() ;
  var context ;
  
  context = view.renderContext();
  view.set('isVisible', true);
  view.prepareContext(context, true);
  ok(!context.hasClass('hidden'), 'should falseT have hidden class');
  
  context = view.renderContext();
  view.set('isVisible', false);
  view.prepareContext(context, true);
  ok(context.hasClass('hidden'), 'should have hidden class');  
});

test("invokes render() passing context & firstTime", function() {

	var runCount = 0;
  var context, isFirstTime ;
  var view = SC.View.create({
  	render: function(theContext, firstTime) {
  		equals(context, theContext, 'context passed');
  		equals(firstTime, isFirstTime, 'firstTime passed');
  		runCount++;
  	}
  }) ;
  
  context = view.renderContext();
  isFirstTime = true;
	view.prepareContext(context, true);  
	equals(runCount, 1, 'did invoke render()');

  runCount = 0 ;
  context = view.renderContext();
  isFirstTime = false;
	view.prepareContext(context, false);  
	equals(runCount, 1, 'did invoke render()');
});

test("invokes renderMixin() from mixins, passing context & firstTime", function() {

	var runCount = 0;
  var context, isFirstTime ;
	
	// define a few mixins to make sure this works w/ multiple mixins  	
	var mixinA = {
  	renderMixin: function(theContext, firstTime) {
  		equals(context, theContext, 'context passed');
  		equals(firstTime, isFirstTime, 'firstTime passed');
  		runCount++;
  	}
	};

	var mixinB = {
  	renderMixin: function(theContext, firstTime) {
  		equals(context, theContext, 'context passed');
  		equals(firstTime, isFirstTime, 'firstTime passed');
  		runCount++;
  	}
	};

  var view = SC.View.create(mixinA, mixinB) ;
  
  context = view.renderContext();
  isFirstTime = true;
	view.prepareContext(context, true);  
	equals(runCount, 2, 'did invoke renderMixin() from both mixins');

  runCount = 0 ;
  context = view.renderContext();
  isFirstTime = false;
	view.prepareContext(context, false);  
	equals(runCount, 2, 'did invoke renderMixin() from both mixins');
});

