// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

module("SC.Validator.Date");

test("Converts into date if a value is given",function(){
  
    var num = 1234947136000; // represents time in secs
    var c = SC.Validator.Date.fieldValueForObject(1234947136000,'','');
    equals(true,c === "Feb 18, 2009 12:52:16 AM","Number converted to date format");
});

test("Converts into number when date string is given", function(){
    var da = "Feb 18, 2009 12:52:16 AM"; // date string
    var d = SC.Validator.Date.objectForFieldValue("Feb 18, 2009 12:52:16 AM",'','');
    equals(true,d === 1234947136000,"Date String compared with value in seconds");
    equals(true,SC.typeOf(d) == "number","Number is obtained"); 	
});

plan.run();
