// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Apple Inc. and contributors.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

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