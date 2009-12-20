// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*global tiki */

"require license";
"use exports SC SproutCore YES NO";  // same as runtime
var SC = require('core');

// require the public API.  these will enhance the SC object
require('controllers/array');
require('controllers/controller');
require('controllers/object');
require('controllers/tree');

require('ext/object');
require('ext/run_loop');

require('mixins/button');
require('mixins/collection_content');
require('mixins/content_display');
require('mixins/control');
require('mixins/editable');
require('mixins/inline_text_field');
require('mixins/selection_support');
require('mixins/static_layout');
require('mixins/string');
require('mixins/tree_item_content');
require('mixins/validatable');

require('panes/main');
require('panes/pane');

require('system/application');
require('system/benchmark');
require('system/browser');
require('system/builder');
require('system/bundle');
require('system/core_query');
require('system/cursor');
require('system/datetime');
require('system/event');
require('system/image_cache');
require('system/json');
require('system/locale');
require('system/page');
require('system/ready');
require('system/render_context');
require('system/request');
require('system/responder');
require('system/responder_context');
require('system/response');
require('system/root_responder');
require('system/routes');
require('system/text_selection');
require('system/time');
require('system/timer');
require('system/user_defaults');
require('system/utils');

require('validators/credit_card');
require('validators/date');
require('validators/email');
require('validators/not_empty');
require('validators/number');
require('validators/password');
require('validators/validator');

require('views/container');
require('views/field');
require('views/image');
require('views/label');
require('views/text_field');
require('views/view');

// optionally load debug code...
var sys = require('system', 'default');
if (sys && sys.env & sys.env.mode !== 'production') {
  require('debug/control_test_pane');
}

module.exports = SC ;