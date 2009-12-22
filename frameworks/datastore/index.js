// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

// import the core namespace and make it our own
var SC = require('core');
exports = module.exports = SC;

// now import all other public modules
require('data_sources/cascade');
require('data_sources/data_source');
require('data_sources/fixtures');

require('models/fetched_attribute');
require('models/many_attribute');
require('models/record');
require('models/record_attribute');
require('models/single_attribute');

require('system/many_array');
require('system/nested_store');
require('system/query');
require('system/record_array');
require('system/store');
