const messages = {
  srcNoAsync: 'Script elements with src attributes must have async attributes.',
  noSrcAsync: 'Script elements without src attributes must not have async attributes.'
};

module.exports = {
  id: 'external-script-async',
  description: 'Only scripts with src attributes must have async attributes',
  messages: messages,
  init: (parser, reporter) => {
    parser.addListener('tagstart', (event) => {
      if (event.tagName === 'script') {
        const self = this,
              attrs = event.attrs,
              l = attrs.length;
        let i = 0,
            attr,
            src,
            async;
        for (; i < l; i++) {
          if ((attr = attrs[i]).name === 'src') {
            src = true;
            if (async) {
              break;
            }
          } else if (attr.name === 'async') {
            async = true;
            if (src) {
              break;
            }
          }
        }
        if (src && !async || !src && async) {
          reporter.error(src && !async ? messages.srcNoAsync : messages.noSrcAsync, event.line, event.col + event.tagName.length + attr.index + 1, self, attr.raw);
        }
      }
    });
  }
};
