// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

var parent, child;
module("SC.View#replaceChild", {
	setup: function() {
	  child = SC.View.create();
	  parent = SC.View.create({
	    childViews: [SC.View, SC.View, SC.View]
	  });		
	}
});


test("swaps the old child with the new child", function() {
  var oldChild = parent.childViews[1];

  parent.replaceChild(child, oldChild);
  equals(child.get('parentView'), parent, 'child has new parent');
  ok(!oldChild.get('parentView'), 'old child no longer has parent');
  
  equals(parent.childViews[1], child, 'parent view has new child at loc 1');
  equals(parent.childViews.length, 3, 'parent has same number of children');
});

plan.run();
