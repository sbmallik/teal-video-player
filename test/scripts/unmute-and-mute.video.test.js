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
    
  testName = test('unmute-mute-video', async() => {
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
    // Wait for the unmute button to display after video starts
    const unmuteButton = await driver.wait(until.elementLocated(By.css('#unmuteTealSvg')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(unmuteButton), global.ELEMENT_TIMEOUT);
    // Click the unmute button
    await driver.findElement(By.css('#unmuteTealSvg')).click();
    // Validate the unmute button is hidden
    await driver.wait(until.elementLocated(By.css('.tealplayer-volume-wrap .btn-index-1.tealplayer-vis-hidden')), global.ELEMENT_TIMEOUT);
    // Pause for a second
    await driver.sleep(1000);
    // Wait for the mute button to display after video starts
    const muteButton = await driver.wait(until.elementLocated(By.css('#muteTealSvg')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(muteButton), global.ELEMENT_TIMEOUT);
    // Click the mute button
    await driver.findElement(By.css('#muteTealSvg')).click();
    // Validate the mute button is hidden
    await driver.wait(until.elementLocated(By.css('.tealplayer-volume-wrap .btn-index-0.tealplayer-vis-hidden')), global.ELEMENT_TIMEOUT);
  });
    
  afterEach(async() => {
    await utils.updateSauce(driver, testName.description, testName.status());
    await driver.quit();
  });
});
