// ========================================================================
// SproutCore -- JavaScript Application Framework
// Copyright ©2006-2008, Sprout Systems, Inc. and contributors.
// Portions copyright ©2008 Apple, Inc.  All rights reserved.
// ========================================================================

require('views/view') ;

// A SpinnerView can be used to show state when loading.
SC.SpinnerView = SC.View.extend({
  isVisibleBindingDefault: SC.Binding.Not
}) ;