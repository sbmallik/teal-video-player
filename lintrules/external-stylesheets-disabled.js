const messages = {
  extStyleSheetDisabledMsg: 'External stylesheet disabled.'
};

module.exports = {
  id: 'external-stylesheets-disabled',
  description: 'External stylesheet disabled.',
  messages: messages,
  init: (parser, reporter) => {
    parser.addListener('tagstart', (event) => {
      if (event.tagName === 'link') {
        const self = this,
              attrs = event.attrs,
              l = attrs.length;
        let i = 0,
            attr;
        for (; i < l; i++) {
          if ((attr = attrs[i]).name === 'rel' && attr.value.indexOf('stylesheet') > -1) {
            reporter.error(messages.extStyleSheetDisabledMsg, event.line, event.col + event.tagName.length + attr.index + 1, self, attr.raw);
            break;
          }
        }
      }
    });
  }
};
