'use strict';

const {By, until} = requireAbs('/test/jest-utils/constants.js'),
      utils = requireAbs('/test/jest-utils/utils.js');
    
describe('teal player test', () => {
  let driver, // @type {WebDriver}
      testName;
    
  beforeEach(async() => {
    driver = await utils.remoteDriverInit();
    await driver.get(global.baseUrl + '/videos/news/have-you-seen/2020/09/15/firefighters-saved-trapped-puppy-underneath-owners-recliner/5804308002/?gnt-test-navpromo&gnt-test-alert=off&gnt-hostname-override=www.usatoday.com&gnt-test-navigation&tealadurl=https%3A%2F%2Fplayertest.longtailvideo.com/vast-30s-ad.xml#gnt-disable-x&gnt-disable-taboola');
  });
    
  testName = test('skip-preroll-ad', async() => {
    // Wait for the spinner to display
    const tealplayerSpinner = await driver.wait(until.elementLocated(By.css('.tealplayer-spinner')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(tealplayerSpinner), global.ELEMENT_TIMEOUT);
    // Wait for the spinner to dissipate
    await driver.wait(until.elementLocated(By.css('.tealplayer-spinner-hidden')), 30000);
    // Wait for the pre-roll AD to disaplay
    const preRollAd = await driver.wait(until.elementLocated(By.css('.teal-ad-playback')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(preRollAd), global.ELEMENT_TIMEOUT);
    // Wait for the skip AD button to display
    const skipButton = await driver.wait(until.elementLocated(By.css('.tealplayer-ad-skip-text')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(skipButton), 20000);
    await driver.findElement(By.css('.tealplayer-ad-skip-text')).click();
    // Ensure preroll AD stopped
    const prerollAdContainer = await driver.wait(until.elementLocated(By.css('.tealplayer-ad-container')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsNotVisible(prerollAdContainer), global.ELEMENT_TIMEOUT);
  });
    
  afterEach(async() => {
    await utils.updateSauce(driver, testName.description, testName.status());
    await driver.quit();
  });
});
