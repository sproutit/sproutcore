// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

module("Timer.schedule single timer") ;

test("single timer should execute once and invalidate", function() {
  var fired = [] ;
  
  SC.RunLoop.begin() ;
  var start = SC.RunLoop.currentRunLoop.get('startTime') ;
  var t = SC.Timer.schedule({
    target: this,
    action: function() { fired.push(Date.now()); },
    interval: 100, 
    repeats: false
  });
  SC.RunLoop.end() ;
  
  var checks = 10 ;
  var f = function f() {
    
    if (fired.length === 0 && --checks > 0) {
      // wait(100, f);
      setTimeout(f, 100) ; 
      return ;
    }
    
    // should only fire once
    equals(1, fired.length, 'fired count') ;
    
    // timer should no longer be valid
    equals(false, t.get('isValid'), 'isValid');
    
    window.start() ; // starts the test runner
  } ;
  
  stop() ; // stops the test runner
  setTimeout(f, 300) ;
});

test("repeating timer with no limit should repeat until terminated", function() {
  var fired = [] ;
  
  // schedule repeating timer
  SC.RunLoop.begin() ;
  var start = SC.RunLoop.currentRunLoop.get('startTime') ;
  var runs = 4 ;
  
  var t = SC.Timer.schedule({
    target: this,
    action: function() { 
      fired.push(Date.now()); 
      if (--runs <= 0) t.invalidate(); 
    },
    interval: 100, 
    repeats: true
  });
  SC.RunLoop.end() ;
  
  // We can't gaurantee when timeouts will execute in the browser so we 
  // have to be a little flexible about testing repeated loops like this.
  var checks = 10 ;
  var f = function f() {
    
    if (--checks < 0) {
      window.start();
      equals(true, false, 'Check Count Exceeded') ;
    }
    
    if (runs > 0) {
      // wait(100, f) ; // wait until timer fires 4 times.
      setTimeout(f, 100) ;
    } else {
      var diffs = fired.map(function(x) { return x - start; });
      equals(4, fired.length, 'fired count: %@'.fmt(diffs.join(', '))) ;
      equals(false, t.get('isValid'), 'isValid') ;
      window.start() ; // starts the test runner
    }
  };
  
  stop() ; // stops the test runner
  setTimeout(f, 600) ;
});

test("repeating timer should terminate after expiration", function() {
  var fired = [] ;
  
  // schedule repeating timer
  SC.RunLoop.begin() ;
  var start = SC.RunLoop.currentRunLoop.get('startTime') ;
  var runs = 4 ;
  
  var t = SC.Timer.schedule({
    target: this,
    action: function() { 
      fired.push(Date.now()); 
    },
    interval: 100, 
    repeats: true,
    until: start + 500
  });
  SC.RunLoop.end() ;
  
  // We can't gaurantee when timeouts will execute in the browser so we 
  // have to be a little flexible about testing repeated loops like this.
  var checks = 10 ;
  var f = function f() {
    if (--checks < 0) {
      window.start();
      equals(true, false, 'Timer never invalidated :') ;
    }
    
    if ((checks > 0) && t.get('isValid')) {
      //wait(100, f);
      setTimeout(f, 100) ;
    } else {
      var diffs = fired.map(function(x) { return x - start; });
      equals(false, t.get('isValid'), 'Timer did not terminate: %@'.fmt(diffs.join(', '))) ;
      window.start() ; // starts the test runner
    }
  };
  
  stop() ; // stops the test runner
  setTimeout(f, 600) ;
});

test("scheduling multiple timers at the same time should cause them to fire at same time", function() {
  
  var f1 = 0; var f2 = 0;
  SC.RunLoop.begin() ;
  var start = SC.RunLoop.currentRunLoop.get('startTime') ;
  
  var t1 = SC.Timer.schedule({
    target: this, 
    action: function() { 
      f1 = SC.RunLoop.currentRunLoop.get('startTime'); 
    },
    interval: 100
  });
  
  var t2 = SC.Timer.schedule({
    target: this, 
    action: function() { 
      f2 = SC.RunLoop.currentRunLoop.get('startTime'); 
    },
    interval: 100
  });

  SC.RunLoop.end();
  
  // be lenient on execution time since we can't control the browser.
  var tries = 10 ;
  var f = function f() {
    if ((f1 === 0 || f2 === 0) && --tries >= 0) {
      // wait(100, f) ;
      setTimeout(f, 100) ;
      return ;
    }
    
    equals(f1, f2, 'execution time f1 == f2');
    equals(false, t1.get('isValid'), 't1.isValid') ;
    equals(false, t2.get('isValid'), 't2.isValid') ;
    window.start() ; // starts the test runner
  } ;
  
  stop() ; // stops the test runner
  setTimeout(f, 200) ;
});

plan.run();
