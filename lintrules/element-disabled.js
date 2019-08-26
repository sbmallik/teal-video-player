const messages = {
        elementDisabledMsg: 'Element disabled: '
      },
      elementBlacklist = [
        'acronym',
        'applet',
        'b',
        'basefont',
        'big',
        'blink',
        'center',
        'embed',
        'font',
        'frame',
        'frameset',
        'i',
        'marquee',
        'noembed',
        'object',
        'param',
        'plaintext',
        'pre',
        's',
        'slot',
        'small',
        'strike',
        'tt',
        'u'
      ];

module.exports = {
  id: 'element-disabled',
  description: 'Element disabled',
  messages: messages,
  init: (parser, reporter) => {
    parser.addListener('tagstart', (event) => {
      const self = this;
      if (elementBlacklist.indexOf(event.tagName) > -1) {
        reporter.error(messages.elementDisabledMsg + event.tagName, event.line, event.col, self, event.raw);
      }
    });
  }
};
