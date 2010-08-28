// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  If an exception is thrown during execution of your SproutCore app, this
  object will be given the opportunity to handle it.

  By default, a simple error message is displayed prompting the user to
  reload. You could override the handleException method to, for example, send
  an XHR to your servers so you can collect information about crashes in your
  application.

  Since the application is in an unknown state when an exception is thrown, we
  rely on JavaScript and DOM manipulation to generate the error instead of
  using SproutCore views.

  @since SproutCore 1.5
*/

SC.ExceptionHandler = {
  
  /**
    YES if an exception was thrown and the error dialog is visible.

    @property {Boolean}
  */
  isShowingErrorDialog: NO,
  
  /**
    Called when an exception is encountered by code executed using SC.run().

    By default, this will display an error dialog to the user. If you
    want more sophisticated behavior, override this method.

    @param {Exception} exception the exception thrown during execution
  */
  handleException: function(exception) {
    if (this.isShowingErrorDialog) return;

    this._displayErrorDialog(exception);
  },

  /** @private
    Creates the error dialog and appends it to the DOM.

    @param {Exception} exception the exception to display
  */
  _displayErrorDialog: function(exception) {
    var html = this._errorDialogHTMLForException(exception),
        node = document.createElement('div');

    node.id = "sc-error-dialog-background";
    node.innerHTML = html;
    document.body.appendChild(node);

    this.isShowingErrorDialog = YES;
  },

  /** @private
    Given an exception, returns the HTML for the error dialog.

    @param {Exception} exception the exception to display
    @returns {String}
  */
  _errorDialogHTMLForException: function(exception) {  
    var html = [
      '<div id="sc-error-dialog">',
        '<div id="sc-error-dialog-header">',
          '_SC.ExceptionHandler.Error'.loc(),
        '</div>',
        '<p id="sc-error-dialog-message">',
          '_SC.ExceptionHandler.Message'.loc(),
        '</p>',
        '<p id="sc-error-dialog-exception">',
          exception.message ? exception.message : exception,
        '</p>',
        '<div id="sc-error-dialog-reload-button" onclick="window.location.reload();">',
          '_SC.ExceptionHandler.Reload'.loc(),
        '</div>',
      '</div>'
    ];

    return html.join('');
  }

};
