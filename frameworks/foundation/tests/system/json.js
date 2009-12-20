// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Apple Inc. and contributors.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

module("Json Module");
test("Encoding and decoding object graphs",function(){
	var tester = { foo: [1,2,3], bar: { a: "a", b: "b" } };
	var str = SC.json.encode(tester);
	var result = SC.json.decode(str);
	same(result,tester, "round trips");
});



plan.run();
