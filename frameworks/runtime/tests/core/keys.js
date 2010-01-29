// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import core_test:qunit";
var SC = require('index'); // load sproutcore/foundation

module("Fetch Keys ");

test("should get a key array for a specified object ",function(){
	var object1 = {};

	object1.names = "Rahul";
	object1.age = "23";
	object1.place = "Mangalore";

	var object2 = [];
	object2 = SC.keys(object1);
	same(object2,['names','age','place'], 'compare keys');
});

run();
