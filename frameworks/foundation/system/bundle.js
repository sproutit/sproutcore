// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

var SC = require('core');

// TODO: Convert to use tiki loader

/**
  The global bundle methods. See also: lib/boostrap.rhtml
*/
SC.mixin(/** @scope SC */ {
  
  
  /**
    @property
    @default false
    @type {Boolean}
    
    If true, log bundle loading.
  */
  logBundleLoading: false,
  
  /**
    Returns true is bundleName is loaded; false if bundleName is not loaded or
    no information is available.
    
    @param bundleName {String}
    @returns {Boolean}
  */
  bundleIsLoaded: function(bundleName) {
    return tiki.ready(bundleName);
  },
  
  /**
    @private
    
    Execute callback function.
  */
  _scb_bundleDidLoad: function(bundleName, target, method, args) {
    var m = method, t = target ;

    if(SC.typeOf(target) === SC.T_STRING) {
      t = SC.objectForPropertyPath(target);
    }

    if(SC.typeOf(method) === SC.T_STRING) {
      m = SC.objectForPropertyPath(method, t);
    }
    
    if(!m) {

      if(SC.LAZY_INSTANTIATION[bundleName]) {
        var lazyInfo = SC.LAZY_INSTANTIATION[bundleName];

      if(SC.logBundleLoading) console.log("SC.loadBundle(): Bundle '%@' is marked for lazy instantiation, instantiating it now…".fmt(bundleName));            
        
        for(var i=0, iLen = lazyInfo.length; i<iLen; i++) {
          try { 
            lazyInfo[i]();
          }catch(e) {
            console.log("SC.loadBundle(): Failted to lazily instatiate entry for  '%@'".fmt(bundleName));  
          }
        }
        delete SC.LAZY_INSTANTIATION[bundleName];

        if(SC.typeOf(target) === SC.T_STRING) {
          t = SC.objectForPropertyPath(target);
        }
        if(SC.typeOf(method) === SC.T_STRING) {
          m = SC.objectForPropertyPath(method, t);
        }

        if(!method) {
          throw "SC.loadBundle(): could not find callback for lazily instantiated bundle '%@'".fmt(bundleName);

        }
      } else {
        throw "SC.loadBundle(): could not find callback for '%@'".fmt(bundleName);
      }
    }

    if(!args) {
      args = [];
    }

    args.push(bundleName);
    
    var needsRunLoop = !!SC.RunLoop.currentRunLoop;
    if (needsRunLoop) SC.RunLoop.begin() ;
    m.apply(t, args) ;
    if (needsRunLoop) SC.RunLoop.end() 
  },
  
  tryToLoadBundle: function(bundleName, target, method, args) {
    var m, t;
    
    // First see if it is already defined.
    if(SC.typeOf(target) === SC.T_STRING) {
      t = SC.objectForPropertyPath(target);
    }
    if(SC.typeOf(method) === SC.T_STRING) {
      m = SC.objectForPropertyPath(method, t);
    }

    // If the method exists, try to call it. It could have been loaded 
    // through other means but the SC.BUNDLE_INFO entry doesn't exist.
    if(m || SC.LAZY_INSTANTIATION[bundleName]) {
      if(SC.logBundleLoading) console.log("SC.loadBundle(): Bundle '%@' found through other means, will attempt to load…".fmt(bundleName));
      SC.BUNDLE_INFO[bundleName] = {loaded: true};
      return SC.BUNDLE_INFO[bundleName]; 
    }
    return false;
  },
    
  /**
    Dynamically load bundleName if not already loaded. Call the target and 
    method with any given arguments.
    
    @param bundleName {String}
    @param target {Function} 
    @param method {Function}
  */
  loadBundle: function(bundleName, target, method) {
    var idx, len;
    if (method === undefined && SC.typeOf(target) === SC.T_FUNCTION) {
      method = target;
      target = null;
    }

    
    var args = SC.A(arguments).slice(3);
    
    if (target && (method===undefined)) {
      method = target;
      target = this; 
    }
    
    var handler = function() {
      if (SC.T_STRING === typeof target) {
        target = SC.objectForPropertyPath(target);
      }
      
      if (SC.T_STRING === typeof method) {
        method = SC.objectForPropertyPath(method, target);
      }

      // invoke callback only if it exists...
      if (target) {
        if (SC.T_STRING === typeof method) method = target[method];
        if (!method) throw "could not find callback for load";

        SC.RunLoop.begin();
        method.apply(target, args);
        SC.RunLoop.end();
      }
      
      handler = target = method = null; // cleanup memory
    };
    
    tiki.async(bundleName).then(function() {
      tiki.require('tiki').ready(this, handler);
    });
  }
  
});
