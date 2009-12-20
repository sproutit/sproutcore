// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

module("Timer.isPaused") ;

test("setting isPaused should stop firing", function() {
  
  var firedCount = 0, f1, f2, f3 ;
  
  SC.RunLoop.begin() ;
  var start = SC.RunLoop.currentRunLoop.get('startTime') ;
  var t = SC.Timer.schedule({
    target: this,
    action: function() { firedCount++ ; },
    interval: 100,
    repeats: true
  });
  SC.RunLoop.end() ;
  
  // wait for timer to fire twice, then pause it.
  var tries1 = 10 ;
  f1 = function f1() {
    if(firedCount<2) {
      if (--tries1 >= 0) {
        setTimeout(f1, 100) ;
      } else {
        equals(false, true, 'Timer never fired 2 times - f1') ;
        window.start() ; // starts the test runner
      }
    } else {
      equals(false, t.get('isPaused'), 'should start with isPaused = false');
      t.set('isPaused', true) ;
      firedCount = 0 ; // Reset count here.
      setTimeout(f2, 300) ;
    }
  };
  
  // once timer paused, make sure it did not fire again.
  f2 = function f2() {
    equals(0, firedCount, 'timer kept firing!') ;
    equals(true, t.get('isPaused'), 'timer is not paused') ;
    t.set('isPaused', false) ;
    setTimeout(f3, 300) ;
  } ;
  
  // once timer has verified paused, unpause and make sure it fires again.
  var tries2 = 10 ;
  f3 = function f3() {
    if (firedCount <= 2) {
      if (--tries2 >= 0) {
        setTimeout(f3, 100) ;
      } else {
        equals(false, true, "Timer did not resume") ;
        window.start() ; // starts the test runner
      }
      
    // timer fired, clean up.
    } else {
      t.invalidate() ;
      equals(false, t.get('isPaused'), 'timer did not unpause') ;
      window.start() ; // starts the test runner
    }
  };
  
  stop() ; // stops the test runner
  setTimeout(f1, 300) ;
});

// using invalidate on a repeating timer is tested in schedule().

plan.run();
