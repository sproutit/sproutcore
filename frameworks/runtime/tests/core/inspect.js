// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

var obj1,obj2,obj3; //global variables

module("Inspect module",{
  
      setup: function(){	
        obj1 = [1,3,4,9];
        obj2 = 24;     
        obj3 = {};
     }
});


test("SC.inspect module should give a string type",function(){
    var object1 = SC.inspect(obj1); 	
	equals(true,SC.T_STRING === SC.typeOf(object1) ,'description of the array');
	
	var object2 = SC.inspect(obj2);
	equals(true,SC.T_STRING === SC.typeOf(object2),'description of the numbers');
	
	var object3 = SC.inspect(obj3);
	equals(true,SC.T_STRING === SC.typeOf(object3),'description of the object');
});

plan.run();
