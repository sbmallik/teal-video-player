'use strict';

const {By, until} = requireAbs('/test/video/lib/constants.js'),
      utils = requireAbs('/test/video/lib/utils.js');
    
describe('teal player test', () => {
  let driver, // @type {WebDriver}
      testName;
    
  beforeEach(async() => {
    driver = await utils.remoteDriverInit();
    await driver.get(global.baseUrl + '/story/news/2001/01/01/article-name/1/?gnt-test-article=text-short,pos3-video&gnt-test-navpromo&gnt-test-alert=off&gnt-hostname-override=www.usatoday.com&gnt-test-navigation#gnt-disable-x&gnt-disable-taboola');
  });
    
  testName = test('basic-features', async() => {
    await driver.wait(until.elementLocated(By.css('.gnt_em_vp_w')), global.ELEMENT_TIMEOUT);
    await driver.executeScript((pageElement) => {
      let targetElement = document.querySelector(pageElement);
      targetElement.scrollIntoView(true);
    }, ['.gnt_em_vp_w']);
        
    const webElement = await driver.wait(until.elementLocated(By.css('.gnt_em_vp_w')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(webElement), global.ELEMENT_TIMEOUT);

    await driver.findElement(By.css('.gnt_em_vp_svg')).click();
    const videoPlayer = await driver.wait(until.elementLocated(By.css('.tealplayer-play-toggle')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(videoPlayer), global.ELEMENT_TIMEOUT);
    /*
    const iframe1 = await driver.wait(until.elementLocated(By.css('.tealplayer-ad-container iframe')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(iframe1), global.ELEMENT_TIMEOUT);
    await driver.switchTo().frame(iframe1);
    const adElement = await driver.wait(until.elementLocated(By.css('.videoAdUi')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(adElement), global.ELEMENT_TIMEOUT);

    const skipAd = await driver.wait(until.elementLocated(By.css('.videoAdUiSkipButton')), 15000);
    await driver.wait(until.elementIsVisible(skipAd), 15000);

    await driver.findElement(By.css('.videoAdUiSkipButton')).click();
    await driver.switchTo().defaultContent();
    */

    await driver.wait(() => {
      return driver.findElements(By.css('.teal-video-wrap.teal-ad-playback')).then((found) => {
        return found.length === 0;
      });
    }, global.ELEMENT_TIMEOUT, 'Video play started');

    const shareElement = await driver.wait(until.elementLocated(By.css('.tealplayer-share-btn')), global.ELEMENT_TIMEOUT);
    await driver.wait(until.elementIsVisible(shareElement), global.ELEMENT_TIMEOUT);
  });
    
  afterEach(async() => {
    await utils.updateSauce(driver, testName.description, testName.status());
    await driver.quit();
  });
});
