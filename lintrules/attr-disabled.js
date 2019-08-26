const messages = {
        attrDisabledMsg: 'Attribute type disabled: '
      },
      attributeBlacklistR = new RegExp(/^:?(align|bgcolor|border|bordercolor|color|data|ismap|longdesc|marginwidth|on.*|valign|vspace)$/),
      attributeWhitelist = ['onerror'];

module.exports = {
  id: 'attr-disabled',
  description: 'Attribute type disabled',
  messages: messages,
  init: (parser, reporter) => {
    parser.addListener('tagstart', (event) => {
      const self = this,
            attrs = event.attrs,
            l = attrs.length;
      let i = 0,
          attr;
      for (; i < l; i++) {
        if (!attributeWhitelist.includes((attr = attrs[i]).name) && attributeBlacklistR.test(attr.name)) {
          reporter.error(messages.attrDisabledMsg + attr.name, event.line, event.col + event.tagName.length + attr.index + 1, self, attr.raw);
        }
      }
    });
  }
};
