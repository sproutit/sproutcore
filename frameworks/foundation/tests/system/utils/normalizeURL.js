// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

var url,url1,url2;

module("SC.normalizeURL");

test("should normalize the url passed as the parameter",function(){
 url = '/desktop/mydocuments/music';
 equals(SC.normalizeURL(url), 'http://'+window.location.host+'/desktop/mydocuments/music','Path with slash');
 
 url1 = 'desktop/mydocuments/music';
 equals(SC.normalizeURL(url1), '%@/desktop/mydocuments/music'.fmt(window.location.href),'Path without slash');  

 url2 = 'http:';
 equals(true,SC.normalizeURL(url2) === url2,'Path with http:');	
});

plan.run();
