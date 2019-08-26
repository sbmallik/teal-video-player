const bundles = {
  bodyend: {
    files: [
      'js/userTiming-bodyendStart.js',
      'js/userData.js',
      'js/addScript.js',
      'js/pageData.js',
      'js/pageads-init.js',
      'js/pageads.js',
      'js/navAccountSetup.js',
      'js/window-resize.js',
      'js/refreshPage.js',
      'js/bodyendRepstr.js',
      'js/userTiming-bodyendDone.js'
    ]
  },
  chocobobodyend: {
    files: [
      'js/userTiming-bodyendStart.js',
      'js/userData.js',
      'js/addScript.js',
      'js/pageData.js',
      'js/pageads-init.js',
      'js/pageads-pre.js',
      'js/pageads.js',
      'js/refreshPage.js',
      'js/bodyendRepstr.js',
      'js/userTiming-bodyendDone.js'
    ]
  },
  head: {
    files: [
      'js/headObjInit.js',
      'js/localstorage.js',
      'js/parse.js',
      'js/luxEnabled.js',
      'js/userTiming.js',
      'js/userStatusCookies.js',
      'js/localUserData.js',
      'js/headRepstr.js'
    ]
  },
  chocobohead: {
    files: [
      'js/headObjInit.js',
      'js/localstorage.js',
      'js/parse.js',
      'js/luxEnabled.js',
      'js/userTiming.js',
      'js/device-type.js',
      'js/userStatusCookies.js',
      'js/localUserData.js',
      'js/headRepstr.js'
    ]
  },
  main: {
    files: [
      'js/userTiming-mainStart.js',
      'js/core.js',
      'js/eventListenerOverride.js',
      'js/kruxdata.js',
      'js/analytics.js',
      'js/dfp.js',
      'js/taboola.js',
      'js/module-nav.js',
      'js/module-base-skipbutton.js',
      'js/module-base-expandable.js',
      'js/opinionlab.js',
      'js/module-nls.js',
      'js/breakingClose.js',
      'js/module-vp.js',
      'js/module-ss.js',
      'js/core-runsetup.js',
      'js/userTiming-mainDone.js'
    ],
    external: true
  } /* ,
  pbjsandwich: {
    files: [
      'js/prebid.js'
    ],
    external: true
  } */
};

module.exports = bundles;
