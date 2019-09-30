'use strict';

/* eslint-disable object-curly-newline, object-property-newline */

module.exports = [
  {
    tags: ['templates', 'front'],
    name: 'home-front',
    urlEnding: '/?no_ads=true',
    layoutMode: true,
    fullPageMode: true
  },
  {
    tags: ['templates', 'front'],
    name: 'section-front',
    urlEnding: '/sports/?no_ads=true',
    layoutMode: true,
    fullPageMode: true,
    scrollToViewElement: {
      function: 'By.css',
      value: '#post-content',
      documentFunction: 'querySelector',
      documentValue: '#post-content'
    },
    waitBeforeScreenshot: 3000
  },
  {
    tags: ['templates'],
    name: 'article',
    urlEnding: '/story/news/world/2019/06/20/iran-shoots-down-us-drone-heightening-tensions/1508395001/?no_ads=true',
    waitOnElement: 'nav-global',
    fullPageMode: true,
    suppressElement: {
      documentFunction: 'querySelector',
      documentValue: '#post-content'
    }
  },
  {
    tags: ['templates'],
    name: 'sponsored-article',
    urlEnding: '/story/sponsor-story/college-ave-student-loans/2019/05/30/twitter-poll-cost-top-factor-when-choosing-college/1290536001/?&no_ads=true',
    waitOnElement: 'nav-global',
    fullPageMode: true,
    suppressElement: {
      documentFunction: 'querySelector',
      documentValue: '#post-content'
    }
  },
  {
    tags: ['templates'],
    name: 'gallery',
    urlEnding: '/picture-gallery/travel/cruises/2019/06/07/cruise-trips-best-and-cheapest-times-book-hot-spots/1379850001/?no_ads=true',
    waitOnElement: 'nav-global',
    fullPageMode: true,
    suppressElement: {
      documentFunction: 'querySelector',
      documentValue: '#post-content'
    }
  },
  {
    tags: ['templates'],
    name: 'video',
    urlEnding: '/videos/news/health/2019/06/17/worst-time-eating-raw-cookie-dough-now/1475124001/?no_ads=true',
    defaultSelectorValue: '#mainContentSection',
    selector: {
      function: 'By.css'
    }
  },
  {
    tags: ['modules'],
    name: 'opinion-lab',
    urlEnding: '/entertainment/?no_ads=true',
    defaultSelectorValue: 'cta-generic-text',
    selector: {
      function: 'By.css'
    },
    scrollToViewElement: {
      function: 'By.css',
      value: '#post-content',
      documentFunction: 'querySelector',
      documentValue: '#post-content'
    }
  },
  {
    tags: ['modules'],
    name: 'newsletter-signup',
    urlEnding: '/life/?no_ads=true',
    defaultSelectorValue: 'cta-newsletter-signup',
    selector: {
      function: 'By.css'
    },
    scrollToViewElement: {
      function: 'By.css',
      value: '#post-content',
      documentFunction: 'querySelector',
      documentValue: '#post-content'
    }
  },
  {
    tags: ['modules'],
    name: 'up-next',
    urlEnding: '/uw/docs/elements/promo/promo-up-next?demo=true',
    waitOnElement: 'body',
    scrollToBottom: true
  },
  {
    tags: ['modules'],
    name: 'story-summary',
    urlEnding: '/uw/docs/elements/story/story-highlights-variant',
    waitOnElement: 'body',
    fullPageMode: true
  },
  {
    tags: ['modules'],
    name: 'sport-score',
    urlEnding: '/uw/docs/elements/promo/promo-sport-score?demo=true',
    waitOnElement: 'body',
    fullPageMode: true
  },
  {
    tags: ['modules'],
    name: 'alerts',
    urlEnding: '/uw/docs/elements/alerts/alerts-banner',
    waitOnElement: 'body',
    fullPageMode: true,
    layoutMode: true,
    waitBeforeScreenshot: 1000
  }
];
