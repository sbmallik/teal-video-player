const messages = {
  targetBlankRequireNoopener: 'Anchor elements with target="_blank" must have rel="noopener".'
};

module.exports = {
  id: 'target-blank-require-noopener',
  description: 'Anchor elements with target="_blank" must have rel="noopener"',
  messages: messages,
  init: (parser, reporter) => {
    parser.addListener('tagstart', (event) => {
      if (event.tagName === 'a') {
        const self = this,
              attrs = event.attrs,
              l = attrs.length;
        let i = 0,
            attr,
            relNoopener,
            targetBlank;
        for (; i < l; i++) {
          if ((attr = attrs[i]).name === 'target' && attr.value === '_blank') {
            targetBlank = true;
            if (relNoopener) {
              break;
            }
          } else if (attr.name === 'rel' && attr.value.split(' ').indexOf('noopener') > -1) {
            relNoopener = true;
            if (targetBlank) {
              break;
            }
          }
        }
        if (targetBlank && !relNoopener) {
          reporter.error(messages.targetBlankRequireNoopener, event.line, event.col + event.tagName.length + attr.index + 1, self, attr.raw);
        }
      }
    });
  }
};
