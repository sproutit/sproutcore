// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SC */

if ('undefined' === typeof SC) SC = {};

SC.browser = function() {
  var userAgent = navigator.userAgent.toLowerCase();
  var version = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1] ;

  var browser = {
    version: version,
    safari: (/webkit/).test( userAgent ) ? version : 0,
    opera: (/opera/).test( userAgent ) ? version : 0,
    msie: (/msie/).test( userAgent ) && !(/opera/).test( userAgent ) ? version : 0,
    mozilla: (/mozilla/).test( userAgent ) && !(/(compatible|webkit)/).test( userAgent ) ? version : 0,
    mobileSafari: (/apple.*mobile.*safari/).test(userAgent) ? version : 0,
    windows: !!(/(windows)/).test(userAgent),
    mac: !!((/(macintosh)/).test(userAgent) || (/(mac os x)/).test(userAgent)),
    language: (navigator.language || navigator.browserLanguage).split('-', 1)[0]
  };
  
    browser.current = browser.msie ? 'msie' : browser.mozilla ? 'mozilla' : browser.safari ? 'safari' : browser.opera ? 'opera' : 'unknown' ;
  return browser ;
}();

SC.setupBodyClassNames = function() {
  var el = document.body ;
  if (!el) return ;
  var browser, platform, shadows, borderRad, classNames, style;
  browser = SC.browser.current ;
  platform = SC.browser.windows ? 'windows' : SC.browser.mac ? 'mac' : 'other-platform' ;
  style = document.documentElement.style;
  shadows = (style.MozBoxShadow !== undefined) || 
                (style.webkitBoxShadow !== undefined) ||
                (style.oBoxShadow !== undefined) ||
                (style.boxShadow !== undefined);
  
  borderRad = (style.MozBorderRadius !== undefined) || 
              (style.webkitBorderRadius !== undefined) ||
              (style.oBorderRadius !== undefined) ||
              (style.borderRadius !== undefined);
  
  classNames = el.className ? el.className.split(' ') : [] ;
  if(shadows) classNames.push('box-shadow');
  if(borderRad) classNames.push('border-rad');
  classNames.push(browser) ;
  classNames.push(platform) ;
  if (SC.browser.msie==7) classNames.push('ie7') ;
  if (SC.browser.mobileSafari) classNames.push('mobile-safari') ;
  el.className = classNames.join(' ') ;
} ;
