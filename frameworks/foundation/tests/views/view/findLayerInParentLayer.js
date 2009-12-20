// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

// ..........................................................
// createChildViews()
// 
var view, parentDom, childDom, layerId ;
module("SC.View#findLayerInParentLayer", {
  setup: function() {
    
    layerId = 'foo-123';
    
    // manually construct a test layer.  next childDom a few layers deep
    childDom = document.createElement('div');
    SC.$(childDom).attr('id', layerId);
    
    var intermediate = document.createElement('div');
    intermediate.appendChild(childDom);
    
    parentDom = document.createElement('div');
    parentDom.appendChild(intermediate);
    intermediate = null;
    
    
    // setup view w/ layerId
    view = SC.View.create({ layerId: layerId });
  },
  
  teardown: function() {
    view = parentDom = childDom = layerId = null;
  }
});

test("discovers layer by finding element with matching layerId - when DOM is in document already", function() {
  document.body.appendChild(parentDom);
  equals(view.findLayerInParentLayer(parentDom), childDom, 'should find childDom');
  document.body.removeChild(parentDom); // cleanup or else next test may fail
});

test("discovers layer by finding element with matching layerId - when parent DOM is falseT in document", function() {
  if(parentDom.parentNode) equals(parentDom.parentNode.nodeType, 11, 'precond - falseT in parent doc');
  else equals(parentDom.parentNode, null, 'precond - falseT in parent doc');
  equals(view.findLayerInParentLayer(parentDom), childDom, 'found childDom');
});


plan.run();
