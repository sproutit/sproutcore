// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation
var system = require('system', 'default');

var object, object1,object3; //global variables

module("Checking the tuple for property path",{
	
	setup: function(){
		 object = SC.Object.create({
			name:'SproutCore',
			value:'',						//no value defined for the property
			objectA:SC.Object.create({
					propertyVal:"chainedProperty"
			})		
		 });
   }

});
   

test("should check for the tuple property", function() {
     var object2 = [];
     object2 = SC.tupleForPropertyPath(object.name,'');
     equals(object2[0], system.global, "the global object");
     equals(object2[1],'SproutCore',"the property name");	
     object2 = SC.tupleForPropertyPath(object.objectA.propertyVal,'object');
	 equals(object2[0],'object',"the root");
     equals(object2[1],'chainedProperty',"a chained property");
});

test("should check for the tuple property when path is undefined",function(){     //test case where no property defined
     var object2;
     object2 = SC.tupleForPropertyPath(object.value,'');
     equals(true,object2 === null,'returns null for undefined path');	
});

plan.run();
