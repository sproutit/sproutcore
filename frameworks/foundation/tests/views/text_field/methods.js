// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation
var Q$ = require('browser/jquery', 'core_test');


// note: need to test interaction with Validators here
// possibly move Validator support to TextFieldView specifically.

var pane, view, view1, view2;

module("SC.TextFieldView",{
  setup: function() {
      SC.RunLoop.begin();
      pane = SC.MainPane.create({
        childViews: [
          SC.TextFieldView.extend({
            hint:'First Name',
            value:'',
            title:'First Name'
          }),
          SC.TextFieldView.extend({
            hint:'Name',
            value:'SproutCore',
            isEnabled: false
          }),
          SC.TextFieldView.extend({
            layerId: 'fieldWithCustomId'
          })
        ]
    });
    pane.append(); // make sure there is a layer...
    SC.RunLoop.end();
    
    view  = pane.childViews[0];
    view1 = pane.childViews[1];
    view2 = pane.childViews[2];
  },
  
  teardown: function() {
      pane.remove();
      pane = view = null ;
    }    
});

test("renders an text field input tag with appropriate attributes", function() {
  equals(view.get('value'), '', 'value should be empty');
  equals(view1.get('value'), 'SproutCore', 'value should not be empty ');
  equals(view.get('isEnabled'),true,'field enabled' );
  equals(view1.get('isEnabled'),false,'field not enabled' );
  var q = Q$('input', view.get('layer'));
  equals(q.attr('type'), 'text', 'should have type as text');
  equals(q.attr('name'), view.get('layerId'), 'should have name as view_layerid');
});

test("renders an text field with a custom layerId with correct id and name html attributes", function() {  
  equals(view2.$().attr('id'), 'fieldWithCustomId', 'label html element should have the custom id');
  equals(view2.$input().attr('name'), 'fieldWithCustomId', 'input html element should have the custom name');
});

test("isEnabled=false should add disabled class", function() {
  SC.RunLoop.begin();
  view.set('isEnabled', false);
  SC.RunLoop.end();  
  ok(view.$().hasClass('disabled'), 'should have disabled class');
});

// test("isEnabled=false should add disabled attr to input", function() {
//   SC.RunLoop.begin();
//   view1.set('isEnabled', false);
//   SC.RunLoop.end();  
//   ok(view1.$input().attr('disabled'), 'should have disabled attr');  
//   view1.set('isEditing',true);
//   ok(view1.get('value') === 'SproutCore', 'value cannot be changed');
//   });

test("isEnabled and isEditable mapping", function() {
  var obj= SC.TextFieldView.create();
  obj.set('isEnabled',false);
  equals(obj.get('isEditable'),false);
  obj.set('isEnabled',true);
  equals(obj.get('isEditable'),true);
});

plan.run();
