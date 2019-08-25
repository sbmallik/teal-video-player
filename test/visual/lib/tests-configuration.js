'use strict';

/* eslint-disable object-curly-newline, object-property-newline */

module.exports = [
  {
    tags: ['suite:section'],
    urlEnding: '/?no_ads=true', 
    name: 'homepage-viewport'
  },
  {
    defaultSelectorValue: 'cta-newsletter-signup',
    tags: ['modules', 'module:newsletter'],
    urlEnding: '/sports/?no_ads=true',
    name: 'newsletter',
    selector: {
      function: 'By.css'
    },
    scrollToViewElement: {
      function: 'By.css',
      documentFunction: 'querySelector'
    }
  },
  {
    defaultSelectorValue: 'cta-generic-text',
    tags: ['modules', 'module:opinionlab'],
    urlEnding: '/entertainment/?no_ads=true',
    name: 'opinion-lab',
    selector: {
      function: 'By.css'
    },
    scrollToViewElement: {
      function: 'By.css',
      documentFunction: 'querySelector'
    }
  }
];
