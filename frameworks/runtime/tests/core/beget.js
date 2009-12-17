// ========================================================================
// SC.guidFor Tests
// ========================================================================
/*globals module test ok isObj equals expects */

"import core_test:package core";

var objectA, objectB , arrayA, stringA; // global variables

module("Beget function Module", {
setup: function() {
    objectA = {} ;
    objectB = {} ;
	arrayA  = [1,3];
	stringA ="stringA";
}
});

test("should return a new object with same prototype as that of passed object", function() {
  	equals(true, SC.beget(objectA) !== objectA, "Beget for an object") ;
	equals(true, SC.beget(stringA) !== stringA, "Beget for a string") ;
	equals(true, SC.beget(SC.hashFor(objectB))!==SC.hashFor(objectB), "Beget for a hash") ;
	equals(true, SC.beget(arrayA) !== arrayA, "Beget for an array") ;
});

plan.run(); 