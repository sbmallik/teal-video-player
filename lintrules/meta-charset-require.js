const charSetVal = 'utf-8',
      messages = {
        charsetNotInHead: 'Valid charset present, must be located in head',
        invalidCharsetInHead: 'No valid charset present in head, Use: <meta charset="utf-8" />',
        invalidCharsetValue: 'Invalid charset value, Use: <meta charset="utf-8" />',
        mulitpleCharsetsNotAllowed: 'Only one valid charset is allowable',
        declareEarlyInHead: 'Charset must be declared, one of first few children in head'
      };

module.exports = {
  id: 'meta-charset-require',
  description: '<meta charset="utf-8" /> must be declared early in head',
  messages: messages,
  init: (parser, reporter) => {
    const self = this;
    let inHead = false,
        headChildCount = 0,
        hasValidCharset = false,
        charsetCount = 0;

    function onTagStart(event) {
      const tagName = event.tagName,
            attrs = event.attrs,
            l = attrs.length;
      let i = 0,
          attr = '';

      if (tagName === 'head') {
        inHead = true;
      }
      if (tagName === 'meta') {
        for (; i < l; i++) {
          attr = attrs[i];
          if (attr.name === 'charset') {
            if (attr.value.toLowerCase() === charSetVal) {
              hasValidCharset = true;
            } else {
              reporter.error(messages.invalidCharsetValue, event.line, event.col + event.tagName.length + attr.index + 1, self, attr.raw);
            }
          }
        }
        if (attr.name === 'charset') {
          if (!inHead) {
            reporter.error(messages.charsetNotInHead, event.line, event.col + tagName.length + attr.index + 1, self, attr.raw);
          } else if (headChildCount > 2) {
            reporter.error(messages.declareEarlyInHead, event.line, event.col + tagName.length + event.index + 1, self, event.raw);
          }
          if (++charsetCount > 1) {
            reporter.error(messages.mulitpleCharsetsNotAllowed, event.line, event.col + event.tagName.length + event.index + 1, self, event.raw);
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
        if (!hasValidCharset) {
          reporter.error(messages.invalidCharsetInHead, event.line, event.col + tagName.length + event.index + 1, self, event.raw);
        }
        parser.removeListener('tagend', onTagEnd);
      }
    }

    parser.addListener('tagstart', onTagStart);
    parser.addListener('tagend', onTagEnd);
  }
};
