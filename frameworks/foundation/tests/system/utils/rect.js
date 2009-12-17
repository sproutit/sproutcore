// ========================================================================
// Rect utility Tests
// ========================================================================


module("Rect utilities");

test("Get the X & Y points of a rect", function() {
  var frame = { x: 50, y: 40, width: 700, height: 9000 };
  expect(6);
  equals(SC.minX(frame),50,'Left edge');
  equals(SC.maxX(frame),750,'Right edge');
  equals(SC.midX(frame),400,'Horizontal midpoint');
  
  equals(SC.minY(frame),40, 'Top edge');
  equals(SC.maxY(frame),9040,'Bottom edge');
  equals(SC.midY(frame),4540,'Vertical midpoint');
});

test("Treat empty object as frame with 0 width and height", function() {
  var frame = { };
  expect(6);
  equals(SC.minX(frame),0,'Left edge');
  equals(SC.maxX(frame),0,'Right edge');
  equals(SC.midX(frame),0,'Horizontal midpoint');
  
  equals(SC.minY(frame),0,'Top edge');
  equals(SC.maxY(frame),0,'Bottom edge');
  equals(SC.midY(frame),0,'Vertical midpoint');
});

test("pointInRect() to test if a given point is inside the rect", function(){
  var frame = { x: 50, y: 40, width: 700, height: 9000 };
  
  ok(SC.pointInRect({ x: 100, y: 100 }, frame), "Point in rect");
  equals(false, SC.pointInRect({ x: 40, y: 100 }, frame), "Point out of rect horizontally");
  equals(false, SC.pointInRect({ x: 600, y: 9100 }, frame), "Point out of rect vertically");
  equals(false, SC.pointInRect({ x: 0, y: 0 }, frame), "Point up and left from rect");
  equals(false, SC.pointInRect({ x: 800, y: 9500 }, frame), "Point down and right from rect");
});

test("rectsEqual() tests equality with default delta", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equals(SC.rectsEqual(frame, frame), true, "Frames are same object");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }), true, "Frames have same position and dimensions");
  equals(SC.rectsEqual(frame, { x: 50.08, y: 50, width: 100, height: 100 }), true, "Frame.x above, within delta");
  equals(SC.rectsEqual(frame, { x: 49.92, y: 50, width: 100, height: 100 }), true, "Frame.x below, within delta");
  equals(SC.rectsEqual(frame, { x: 50, y: 50.099, width: 100, height: 100 }), true, "Frame.y within delta");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100.001, height: 100 }), true, "Frame.width within delta");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100.09999 }), true, "Frame.height within delta");
  equals(SC.rectsEqual(frame, { x: 55, y: 50, width: 100, height: 100 }), false, "Frame.x not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 55, width: 100, height: 100 }), false, "Frame.y not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 105, height: 100 }), false, "Frame.width not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 105 }), false, "Frame.height not equal");
});

test("rectsEqual() tests equality with null delta", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equals(SC.rectsEqual(frame, frame), true, "Frames are same object");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }, null), true, "Frames have same position and dimensions");
  equals(SC.rectsEqual(frame, { x: 50.08, y: 50, width: 100, height: 100 }, null), true, "Frame.x above, within delta");
  equals(SC.rectsEqual(frame, { x: 49.92, y: 50, width: 100, height: 100 }, null), true, "Frame.x below, within delta");
  equals(SC.rectsEqual(frame, { x: 50, y: 50.099, width: 100, height: 100 }, null), true, "Frame.y within delta");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100.001, height: 100 }, null), true, "Frame.width within delta");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100.01 }, null), true, "Frame.height within delta");
  equals(SC.rectsEqual(frame, { x: 55, y: 50, width: 100, height: 100 }, null), false, "Frame.x not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 55, width: 100, height: 100 }, null), false, "Frame.y not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 105, height: 100 }, null), false, "Frame.width not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 105 }, null), false, "Frame.height not equal");
});

test("rectsEqual() tests equality with delta of 10", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equals(SC.rectsEqual(frame, frame), true, "Frames are same object");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }, 10), true, "Frames have same position and dimensions");
  equals(SC.rectsEqual(frame, { x: 59.99, y: 50, width: 100, height: 100 }, 10), true, "Frame.x above, within delta");
  equals(SC.rectsEqual(frame, { x: 41, y: 50, width: 100, height: 100 }, 10), true, "Frame.x below, within delta");
  equals(SC.rectsEqual(frame, { x: 50, y: 59, width: 100, height: 100 }, 10), true, "Frame.y within delta");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 109, height: 100 }, 10), true, "Frame.width within delta");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100.000002 }, 10), true, "Frame.height within delta");
  equals(SC.rectsEqual(frame, { x: 61, y: 50, width: 100, height: 100 }, 10), false, "Frame.x not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 92, width: 100, height: 100 }, 10), false, "Frame.y not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 89, height: 100 }, 10), false, "Frame.width not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 89.99999 }, 10), false, "Frame.height not equal");
});

test("rectsEqual() tests equality with delta of 0", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equals(SC.rectsEqual(frame, frame), true, "Frames are same object");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }, 0), true, "Frames have same position and dimensions");
  equals(SC.rectsEqual(frame, { x: 50.0001, y: 50, width: 100, height: 100 }, 0), false, "Frame.x not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 51, width: 100, height: 100 }, 0), false, "Frame.y not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 99, height: 100 }, 0), false, "Frame.width not equal");
  equals(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 102 }, 0), false, "Frame.height not equal");
});