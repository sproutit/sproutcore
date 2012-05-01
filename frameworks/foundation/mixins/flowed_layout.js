// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.ALIGN_JUSTIFY = "justify";
/**
  @namespace 

  Normal SproutCore views are absolutely positioned--parent views have relatively
  little input on where their child views are placed.
  
  This mixin makes a view layout its child views itself, flowing left-to-right
  or up-to-down, and, optionally, wrapping.
  
  Child views with useAbsoluteLayout===YES will be ignored in the layout process.
  This mixin detects when child views have changed their size, and will adjust accordingly.
  It also observes child views' isVisible and calculatedWidth/Height properties, and, as a
  flowedlayout-specific extension, isHidden.
  
  These properties are observed through `#js:observeChildLayout` and `#js:unobserveChildLayout`;
  you can override the method to add your own properties. To customize isVisible behavior,
  you will also want to override shouldIncludeChildView.
  
  
  If flowSize is implemented but specifies widthPercent and heightPercent, the width and height
  will be calculated based on padding-adjusted size; values not specified in flowSize will always
  be taken from the flowed view's frame (calculatedWidth/Height ignored).
  
  This view mixes very well with animation. Further, it is able to automatically mix
  in to child views it manages, created or not yet created, allowing you to specify
  settings such as animation once only, and have everything "just work".
  
  Like normal views, you simply specify child views--everything will "just work."
  
  @since SproutCore 1.0
*/
SC.FlowedLayout = {
  /**
    The direction of flow.
  */
  layoutDirection: SC.LAYOUT_HORIZONTAL,

  /**
    Whether the view should automatically resize (to allow scrolling, for instance)
  */
  autoResize: YES,
  
  /**
    The alignment of items within rows or columns.
  */
  align: SC.ALIGN_LEFT,
  
  /**
    If YES, flowing child views are allowed to wrap to new rows or columns.
  */
  canWrap: YES,
  
  /**
    A set of spacings (left, top, right, bottom) for subviews. Defaults to 0s all around.
    This is the amount of space that will be before, after, above, and below the view. These
    spacings do not collapse into each other.
    
    You can also set flowSpacing on any child view, or implement flowSpacingForView.
  */
  defaultFlowSpacing: { left: 0, bottom: 0, top: 0, right: 0 },
  
  /**
    Padding around the edges of this flow layout view.
  */
  flowPadding: { left: 0, bottom: 0, right: 0, top: 0 },
  
  
  concatenatedProperties: ["childMixins"],
  
  initMixin: function() {
    this.invokeOnce("_scfl_tile");
  },
  
  /**
    Detects when the child views change.
  */
  _scfl_childViewsDidChange: function(c) {
    this.invokeOnce("_scfl_tile");
  }.observes("childViews"),
  
  _scfl_layoutPropertyDidChange: function(){
    this.invokeOnce("_scfl_tile");
  },
  
  /**
    Overriden to only update if it is a view we do not manage, or the width or height has changed
    since our last record of it.
  */
  layoutDidChangeFor: function(c) {
    // if it is absolute layout (no flowing) then we need to let SC.View handle it
    if (c.get("useAbsoluteLayout")) return sc_super();
    
    // if we have not flowed yet, ignore as well
    if (!this._scfl_itemLayouts) return sc_super();
    
    // now, check if anything has changed
    var l = this._scfl_itemLayouts[SC.guidFor(c)];
    if (!l) return sc_super();
    if (c.layout.width === l.width && c.layout.height === l.height) return sc_super();
    
    // nothing has changed. This is where we do something
    this.invokeOnce("_scfl_tile");
    sc_super();
  },
  
  /**
    Sets up layout observers on child view. We observe three things:
    - isVisible
    - calculatedWidth
    - calculatedHeight
    
    Actual layout changes are detected through layoutDidChangeFor.
  */
  observeChildLayout: function(c) {
    if (c._scfl_isBeingObserved) return;
    c._scfl_isBeingObserved = YES;
    c.addObserver('isVisible', this, '_scfl_layoutPropertyDidChange');
    c.addObserver('isHidden', this, '_scfl_layoutPropertyDidChange');
    c.addObserver('calculatedWidth', this, '_scfl_layoutPropertyDidChange');
    c.addObserver('calculatedHeight', this, '_scfl_layoutPropertyDidChange');
  },
  
  /**
    Removes observers on child view.
  */
  unobserveChildLayout: function(c) {
    c._scfl_isBeingObserved = NO;
    c.removeObserver('isVisible', this, '_scfl_layoutPropertyDidChange');
    c.removeObserver('isHidden', this, '_scfl_layoutPropertyDidChange');
    c.removeObserver('calculatedWidth', this, '_scfl_layoutPropertyDidChange');
    c.removeObserver('calculatedHeight', this, '_scfl_layoutPropertyDidChange');
  },
  
  /**
    Determines whether the specified child view should be included in the flow layout.
    By default, if it has isVisible: NO or isHidden: YES, it will not be included.
  */
  shouldIncludeChild: function(c) {
    return c.get("isVisible") && !c.get("isHidden");
  },
  
  /**
    Returns the flow spacings for a given view. By default, returns the view's flowSpacing,
    and if they don't exist, the defaultFlowSpacing for this view.
  */
  flowSpacingForView: function(idx, view) {
    if (view.get("isSpacer")) return {left:0,top:0,right:0,bottom:0};
    var fm = view.get("flowSpacing");
    if (!SC.none(fm)) return fm;
    return this.get("defaultFlowSpacing");
  },
  
  /**
    Returns the flow size for a given view. The default version checks the view's flowSize,
    then calculatedWidth/Height, then frame.
    
    This should return a structure like: { width: whatever, height: whatever }
  */
  flowSizeForView: function(idx, view) {
    // first try flowSize
    var fs = SC.clone(view.get("flowSize"));
    if (!SC.none(fs)) {
      // if we have a flow size, adjust for a) width/heightPercentage and b) missing params.
      var frame = this.get("frame"), padding = this.get("flowPadding"), spacing = this.flowSpacingForView(idx, view);
      
      // you can't set it w/percentage for the expand direction
      var expandsHorizontal = (this.get("layoutDirection") === SC.LAYOUT_HORIZONTAL && !this.get("canWrap")) ||
        (this.get("layoutDirection") === SC.LAYOUT_VERTICAL && this.get("canWrap"));
      
      if (!SC.none(fs.widthPercentage) && !expandsHorizontal) {
        fs.width = (frame.width - padding.left - padding.right) * fs.widthPercentage - spacing.left - spacing.right;
      }
      if (!SC.none(fs.heightPercentage) && expandsHorizontal) {
        fs.height = (frame.height - padding.top - padding.bottom) * fs.heightPercentage - spacing.top - spacing.bottom;
      }
      if (SC.none(fs.width)) fs.width = view.get("frame").width;
      if (SC.none(fs.height)) fs.height = view.get("frame").height;
      
      return fs;
    }
    
    // then calculated size
    var cw = view.get("calculatedWidth"), ch = view.get("calculatedHeight");
    var calc = {}, f = view.get("frame");
    
    // if there is a calculated width, use that. NOTE: if calculatedWidth === 0,
    // it is invalid.
    if (cw) calc.width = cw;
    else calc.width = f.width;
    
    // same for calculated height
    if (ch) calc.height = ch;
    else calc.height = f.height;
    
    // return
    return calc;
  },
  
  /**
    Takes a row and positions everything within the row, calling updateLayout.
    It should return the row height.
  */
  flowRow: function(row, rowSpace, padding, rowOffset, rowSize, primary, secondary, align) {
    rowOffset += padding[secondary];
    
    // if it is justified, we'll add padding between ALL views.
    var item, len = row.length, idx, layout, rowLength = 0, totalSpaceUnits = 0, spacePerUnit = 0;
    
    // first, determine the width of all items, and find out how many virtual spacers there are
    for (idx = 0; idx < len; idx++) {
      item = row[idx];
      if (item.get("isSpacer")) totalSpaceUnits += item.get("spaceUnits") || 1;
      rowLength += item._scfl_cachedSpacedSize[primary === "left" ? "width" : "height"];
    }
    
    // add space units for justification
    if (len > 1 && align === SC.ALIGN_JUSTIFY) {
      totalSpaceUnits += len - 1;
    }
    
    // calculate space per unit if needed
    if (totalSpaceUnits > 0) {
      spacePerUnit = (rowSpace - rowLength) / totalSpaceUnits;
      rowLength = rowSpace;
    }
    
    // prepare
    var x, y, itemOffset = 0;
    
    // handle align
    if (align === SC.ALIGN_RIGHT || align === SC.ALIGN_BOTTOM) itemOffset = (rowSpace - rowLength);
    else if (align === SC.ALIGN_CENTER || align === SC.ALIGN_MIDDLE) itemOffset = (rowSpace - rowLength) / 2;
    
    // position
    for (idx = 0; idx < len; idx++) {
      item = row[idx];
      
      // now update flow position
      if (primary == "left") {
        x = itemOffset + padding.left;
        y = rowOffset + padding.top;
      } else {
        x = rowOffset + padding.left;
        y = itemOffset + padding.top;
      }
      
      // handle auto size
      if (item.get("fillHeight") && secondary === "top") item._scfl_cachedFlowSize["height"] = rowSize;
      if (item.get("fillWidth") && secondary === "left") item._scfl_cachedFlowSize["width"] = rowSize;
      
      // update offset
      if (item.get("isSpacer")) {
        // the cached size is the minimum size for the spacer
        var spacerSize = item._scfl_cachedSpacedSize[primary === "left" ? "width" : "height"];
        
        // get the spacer size
        spacerSize = Math.max(spacerSize, spacePerUnit * (item.get("spaceUnits") || 1));
        
        // add to item offset
        itemOffset += spacerSize;
        
        // and finally, set back the cached flow size value--
        // not including spacing (this is the view size for rendering)
        item._scfl_cachedFlowSize[primary === "left" ? "width" : "height"] = spacerSize;
        item._scfl_cachedFlowSize[secondary === "left" ? "width" : "height"] = rowSize;
      } else {
        itemOffset += item._scfl_cachedSpacedSize[primary === "left" ? "width" : "height"];
      }
      
      this.flowPositionView(idx, item, x, y);
      
      // update justification
      if (align === SC.ALIGN_JUSTIFY) itemOffset += spacePerUnit;
    }
  },
  
  flowPositionView: function(idx, item, x, y) {
    var spacing = item._scfl_cachedFlowSpacing, size = item._scfl_cachedFlowSize;
    var last = this._scfl_itemLayouts[SC.guidFor(item)];
    
    var l = {
      left: x + spacing.left,
      top: y + spacing.top,
      width: size.width,
      height: size.height
    };
    
    // we must set this first, or it will think it has to update layout again, and again, and again
    // and we get a crash.
    this._scfl_itemLayouts[SC.guidFor(item)] = l;
    
    // Also, never set if the same. We only want to compare layout properties, though
    if (last && 
      last.left == l.left && last.top == l.top && 
      last.width == l.width && last.height == l.height
    ) {
      return;
    }
    
    item.set("layout", l);
  },
  
  _scfl_tile: function() {
    if (!this._scfl_itemLayouts) this._scfl_itemLayouts = {};
    
    var isObserving = this._scfl_isObserving || SC.CoreSet.create(),
        nowObserving = SC.CoreSet.create();
    
    var children = this.get("childViews"), child, idx, len = children.length,
        rows = [], row = [], rowSize = 0, 
        rowOffset = 0, 
        itemOffset = 0, 
        width = this.get('frame').width,
        height = this.get('frame').height,
        canWrap = this.get("canWrap"),
        layoutDirection = this.get("layoutDirection"),
        padding = this.get("flowPadding"),
        childSize, childSpacing, align = this.get("align");
    
    var primary, primary_os, primary_d, secondary, secondary_os, secondary_d, primaryContainerSize;
    if (layoutDirection === SC.LAYOUT_HORIZONTAL) {
      primaryContainerSize = width - padding["right"] - padding["left"];
      primary = "left"; secondary = "top";
      primary_os = "right"; secondary_os = "bottom";
      primary_d = "width"; secondary_d = "height";
    } else {
      primaryContainerSize = height - padding["bottom"] - padding["top"];
      primary = "top"; secondary = "left";
      primary_os = "bottom"; secondary_os = "right";
      primary_d = "height"; secondary_d = "width";
    }
    
    // now, loop through all child views and group them into rows.
    // note that we are NOT positioning.
    // when we are done with a row, we call flowRow to finish it.
    for (idx = 0; idx < len; idx++) {
      // get a child.
      child = children[idx];
      if (child.get("useAbsoluteLayout")) continue;
      
      // update observing lists
      isObserving.remove(SC.guidFor(child));
      nowObserving.add(child);
      
      // skip positioning of items with isVisible===false
      if (!this.shouldIncludeChild(child)) continue;
      
      // get spacing, size, and cache
      childSize = this.flowSizeForView(idx, child);
      
      // adjust for spacer
      if (child.get("isSpacer")) {
        childSize[primary_d] = 0;
      }
      
      child._scfl_cachedFlowSize = { width: childSize.width, height: childSize.height }; // supply a clone, since we are about to modify
      
      childSpacing = this.flowSpacingForView(idx, child);
      childSize.width += childSpacing.left + childSpacing.right;
      childSize.height += childSpacing.top + childSpacing.bottom;
      
      // flowRow will use this
      child._scfl_cachedFlowSpacing = childSpacing;
      child._scfl_cachedSpacedSize = childSize;
      
      // determine if the item can fit in the row
      if (canWrap && row.length > 0) {
        // test, including the collapsed right margin+padding
        if (itemOffset + childSize[primary_d] >= primaryContainerSize) {
          // first, flow this row
          this.flowRow(row, primaryContainerSize, padding, rowOffset, rowSize, primary, secondary, align);
          
          // We need another row.
          row = [];
          rows.push(row);
          rowOffset += rowSize;
          rowSize = 0;
          itemOffset = 0;
        }
      }
      
      // add too row and update row size+item offset
      row.push(child);
      rowSize = Math.max(childSize[secondary_d], rowSize);
      itemOffset += childSize[primary_d]; 
    }
    
    // flow last row
    this.flowRow(row, primaryContainerSize, padding, rowOffset, rowSize, primary, secondary, align);

    
    // update calculated width/height
    this._scfl_lastFrameSize = this.get("frame");
    if (!canWrap && this.get("autoResize")) {
      this._scfl_lastFrameSize[primary_d] = itemOffset + padding[primary] + padding[primary_os];
      this.adjust(primary_d, itemOffset + padding[primary] + padding[primary_os]);
    } else if (this.get("autoResize")) {
      this._scfl_lastFrameSize[secondary_d] = rowOffset + rowSize + padding[secondary] + padding[secondary_os];
      this.adjust(secondary_d, rowOffset + rowSize + padding[secondary] + padding[secondary_os]);
    }
    
    
    // cleanup on aisle 7
    len = isObserving.length;
    for (idx = 0; idx < len; idx++) {
      this.unobserveChildLayout(isObserving[idx]);
    }

    len = nowObserving.length;
    for (idx = 0; idx < len; idx++) {
      this.observeChildLayout(nowObserving[idx]);
    }
    
    this._scfl_isObserving = nowObserving;
  },
  
  _scfl_frameDidChange: function() {
    // if the frame changes but we can't wrap, our results will not update.
    if (!this.get("canWrap")) return;
    
    var frame = this.get("frame"), lf = this._scfl_lastFrameSize;
    this._scfl_lastFrameSize = frame;

    if (lf && lf.width == frame.width && lf.height == frame.height) return;
    
    this.invokeOnce("_scfl_tile");
  }.observes("frame"),
  
  destroyMixin: function() {
    var isObserving = this._scfl_isObserving;
    if (!isObserving) return;
    
    var len = isObserving.length, idx;
    for (idx = 0; idx < len; idx++) {
      this.unobserveChildLayout(isObserving[idx]);
    }
  }
  
};