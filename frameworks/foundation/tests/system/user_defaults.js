// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

var obj; //global variables

module("User Defaults",{
 	   
 	  setup: function(){
 	   
 	   obj = SC.Object.create({
 		   bck : 'green'
 	    }); 	
 	}
});



test("To check if the user defaults are stored and read from local storage",function(){
    SC.userDefaults.writeDefault('Back',obj.bck);
    equals(SC.userDefaults.readDefault('Back'), obj.bck, 'should read written property');
});

plan.run();
