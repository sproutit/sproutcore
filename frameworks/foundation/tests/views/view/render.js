// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

// .......................................................
//  render() 
//
module("SC.View#render");

test("default implementation invokes renderChildViews if firstTime = true", function() {

	var runCount = 0, curContext, curFirstTime;
	var view = SC.View.create({
		renderChildViews: function(context, firstTime) {
	  	equals(context, curContext, 'passed context');
	  	equals(firstTime, curFirstTime, 'passed firstTime flag');
	  	runCount++;
		}
	});
	
	// VERIFY firstTime = true
	curContext = view.renderContext();
	curFirstTime = true ;
	view.render(curContext, curFirstTime);
	equals(runCount, 1, 'did invoke renderChildViews()');

	// VERIFY firstTime = false
	runCount = 0 ;
	curContext = view.renderContext();
	curFirstTime = false ;
	view.render(curContext, curFirstTime);
	equals(runCount, 0, 'did falseT invoke renderChildViews()');
		
});
  
// .......................................................
// renderChildViews() 
//
  
module("SC.View#renderChildViews");

test("creates a context and then invokes prepareContext on each childView", function() {

	var runCount = 0, curContext, curFirstTime ;
	
	var ChildView = SC.View.extend({
	  prepareContext: function(context, firstTime) {
	  	equals(context.prevObject, curContext, 'passed child context of curContext');
	  	equals(firstTime, curFirstTime, 'passed first time flag');
	  	
	  	equals(context.tagName(), this.get('tagName'), 'context setup with current tag name');
	  	
	  	runCount++; // record run
	  }
	});
	
	var view = SC.View.create({
		childViews: [
			ChildView.extend({ tagName: 'foo' }),
			ChildView.extend({ tagName: 'bar' }),
			ChildView.extend({ tagName: 'baz' })
		]
	});

	// VERIFY: firstTime= true 	
	curContext = view.renderContext('div');
	curFirstTime= true ;
	equals(view.renderChildViews(curContext, curFirstTime), curContext, 'returns context');
	equals(runCount, 3, 'prepareContext() invoked for each child view');
	

	// VERIFY: firstTime= false 	
	runCount = 0 ; //reset
	curContext = view.renderContext('div');
	curFirstTime= false ;
	equals(view.renderChildViews(curContext, curFirstTime), curContext, 'returns context');
	equals(runCount, 3, 'prepareContext() invoked for each child view');

});

plan.run();
