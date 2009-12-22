// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

// inform the build system of the symbols we want to export here.
// this way import sproutcore/runtime will continue to work
"require license";
"use exports SC SproutCore YES NO";

// export the basic namespace
exports = module.exports = require('core');

// require all the other package exports.  These will add themselves to the
// SC namespace
require('mixins/array');
require('mixins/comparable');
require('mixins/copyable');
require('mixins/delegate_support');
require('mixins/enumerable');
require('mixins/freezable');
require('mixins/observable');

require('system/binding');
require('system/cookie');
require('system/enumerator');
require('system/error');
require('system/index_set');
require('system/logger');
require('system/object');
require('system/range_observer');
require('system/run_loop');
require('system/selection_set');
require('system/set');
require('system/sparse_array');
