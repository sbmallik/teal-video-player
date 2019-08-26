const messages = {
  viewportNotInHead: 'Valid <meta name="viewport"/> present, must be located in head',
  invalidViewportInHead: 'No valid <meta name="viewport" /> in head, Use: <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />',
  multipleViewportsNotAllowed: 'Only one valid <meta name="viewport" /> is allowable',
  declareEarlyInHead: 'Viewport must be declared, one of first few children in head',
  invalidContentWidth: 'No valid content - width set, Use: "width=device-width"',
  invalidContentInitialScale: 'No valid content - initial scale set, Use: "initial-scale=1.0"',
  invalidContentMaximumScale: 'No valid content - maximum scale set, Use: "maximum-scale=1.0"',
  invalidContentMinimumScale: 'No valid content - minimum scale set, Use: "minimum-scale=1.0"',
  invalidContentUserScalable: 'No valid content - user-scalable set, Use: "user-scalable=no"'
};

module.exports = {
  id: 'meta-viewport-require',
  description: '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" /> must be declared early in head',
  messages: messages,
  init: (parser, reporter) => {
    const self = this;
    let inHead = false,
        headChildCount = 0,
        hasViewport = false,
        hasValidViewport = false,
        viewportCount = 0;

    function onTagStart(event) {
      const tagName = event.tagName,
            attrs = event.attrs,
            l = attrs.length;
      let i = 0,
          attr;

      if (tagName === 'head') {
        inHead = true;
      }

      if (tagName === 'meta') {
        for (; i < l; i++) {
          attr = attrs[i];
          if (attr.name === 'name' && attr.value === 'viewport') {
            hasViewport = true;
          }
          if (attr.name === 'content') {
            if (hasViewport) {
              let widthSet = false,
                  initialScaleSet = false,
                  maximumScaleSet = false,
                  minimumScaleSet = false,
                  userScalableSet = false;
              if (attr.value.indexOf('width=device-width') > -1) {
                widthSet = true;
              } else {
                reporter.error(messages.invalidContentWidth, event.line, event.col + tagName.length + attr.index + 1, self, attr.raw);
              }
              if (attr.value.indexOf('initial-scale=1.0') > -1) {
                initialScaleSet = true;
              } else {
                reporter.error(messages.invalidContentInitialScale, event.line, event.col + tagName.length + attr.index + 1, self, attr.raw);
              }
              if (attr.value.indexOf('maximum-scale=1.0') > -1) {
                maximumScaleSet = true;
              } else {
                reporter.error(messages.invalidContentMaximumScale, event.line, event.col + tagName.length + attr.index + 1, self, attr.raw);
              }
              if (attr.value.indexOf('minimum-scale=1.0') > -1) {
                minimumScaleSet = true;
              } else {
                reporter.error(messages.invalidContentMinimumScale, event.line, event.col + tagName.length + attr.index + 1, self, attr.raw);
              }
              if (attr.value.indexOf('user-scalable=no') > -1) {
                userScalableSet = true;
              } else {
                reporter.error(messages.invalidContentUserScalable, event.line, event.col + tagName.length + attr.index + 1, self, attr.raw);
              }
              if (widthSet && initialScaleSet && maximumScaleSet && minimumScaleSet && userScalableSet) {
                hasValidViewport = true;
              }
            }
          }
        }

        if (hasViewport) {
          if (!inHead) {
            reporter.error(messages.viewportNotInHead, event.line, event.col + tagName.length + attr.index + 1, self, attr.raw);
          } else if (headChildCount > 5) {
            reporter.error(messages.declareEarlyInHead, event.line, event.col + tagName.length + event.index + 1, self, event.raw);
          }
          if (++viewportCount > 1) {
            reporter.error(messages.multipleViewportsNotAllowed, event.line, event.col + event.tagName.length + event.index + 1, self, event.raw);
          }
        }
      }

      if (inHead) {
        headChildCount++;
      }
    }


    function onTagEnd(event) {
      const tagName = event.tagName;

      if (tagName === 'head') {
        inHead = false;
        if (!hasValidViewport) {
          reporter.error(messages.invalidViewportInHead, event.line, event.col + tagName.length + event.index + 1, self, event.raw);
        }
        parser.removeListener('tagend', onTagEnd);
      }
    }

    parser.addListener('tagstart', onTagStart);
    parser.addListener('tagend', onTagEnd);
  }
};

// <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
