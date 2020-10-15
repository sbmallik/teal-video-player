'use strict';

const {By, until} = requireAbs('/test/jest-utils/constants.js'),
      utils = requireAbs('/test/jest-utils/utils.js');
    
describe('teal player test', () => {
  let driver, // @type {WebDriver}
      testName;
    
  beforeEach(async() => {
    driver = await utils.remoteDriverInit();
    await driver.get(global.baseUrl + '/videos/news/have-you-seen/2020/09/15/firefighters-saved-trapped-puppy-underneath-owners-recliner/5804308002/?gnt-test-navpromo&gnt-test-alert=off&gnt-hostname-override=www.usatoday.com&gnt-test-navigation#gnt-disable-x&gnt-disable-videoAds&gnt-disable-taboola');
  });
    
  testName = test.only('fullscreen-toggle', async() => {
    // Hover on the video elememnt to ensure control bar display
    const playToggle = await driver.findElement(By.css('.tealplayer-play-toggle'));
    await driver.actions({
      bridge: true
    }).move({
      duration: 1000,
      origin: playToggle,
      x: 0,
      y: 0
    }).perform();
    // Wait for the pause button to display after video starts
    const pauseButton = await driver.wait(until.elementLocated(By.css('#fullscreenTealSvg')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(pauseButton), global.ELEMENT_TIMEOUT);
    // Click the puase button
    await driver.findElement(By.css('#fullscreenTealSvg')).click();
    // Validate the pause button is hidden
    await driver.wait(until.elementLocated(By.css('.tealplayer-fullscreen-btn .btn-index-0.tealplayer-vis-hidden')), global.ELEMENT_TIMEOUT);
    // Pause for a second
    await driver.sleep(1000);
    // Wait for the play button to display after video starts
    const playButton = await driver.wait(until.elementLocated(By.css('#exitFullscreenTealSvg')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(playButton), global.ELEMENT_TIMEOUT);
    // Click the play button
    await driver.findElement(By.css('#exitFullscreenTealSvg')).click();
    // Validate the play button is hidden
    await driver.wait(until.elementLocated(By.css('.tealplayer-fullscreen-btn .btn-index-1.tealplayer-vis-hidden')), global.ELEMENT_TIMEOUT);
  });
    
  afterEach(async() => {
    await utils.updateSauce(driver, testName.description, testName.status());
    await driver.quit();
  });
});
