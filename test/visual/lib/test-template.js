'use strict';

module.exports = (configuration) => {
  return `
    'use strict';

    const {By, Target, until} = requireAbs('/test/visual/lib/constants.js'),
          utils = requireAbs('/test/visual/lib/utils.js'),
          config = require('config');
    
    describe('visual test', () => {
      let driver, // @type {WebDriver}
          eyes, // @type {Eyes}
          configuration, // @type {SeleniumConfiguration}
          testName,
          baseUrl = config.test.url,
          waitOnElement = '#navContainer';
    
      beforeEach(async() => {
        driver = await utils.driverInit();
        eyes = await utils.eyesVisualGridInit();
        configuration = utils.setVisualGridConfig(eyes);
        await eyes.setConfiguration(configuration);
        await driver.get(baseUrl + '${configuration.urlEnding}');
      });
    
      testName = test('${configuration.name}', async() => {
        await eyes.open(driver, global.appName, testName.description);
        ${configuration.scrollToBottom ? `
        await driver.executeScript(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, []);
        await driver.sleep(3000);
        ` : ''}
        ${configuration.scrollToTop ? `
        await driver.executeScript(() => {
          window.scrollTo(0, 0);
        }, []);
        await driver.sleep(3000);
        ` : ''}
        ${configuration.scrollToViewElement ? `
        await driver.wait(until.elementLocated(${configuration.scrollToViewElement.function}('${configuration.scrollToViewElement.value || configuration.defaultSelectorValue}')), 30000);
        await driver.executeScript((pageElement) => {
          let targetElement = document.${configuration.scrollToViewElement.documentFunction}(pageElement),
              headerElement = document.querySelector('#navContainer');
          targetElement.scrollIntoView(true);
          window.scrollBy(0, -(headerElement.offsetHeight));
        }, ['${configuration.scrollToViewElement.documentValue || configuration.defaultSelectorValue}']);
        ` : ''}
        ${configuration.hoverOnElement ? `
        const elem = await driver.findElement(${configuration.hoverOnElement.function}('${configuration.hoverOnElement.selector}'));
        await driver.actions({bridge: true}).move({duration: 1000, origin: elem, x: 0, y: 0}).perform();
        ` : ''}
        ${configuration.clickOnElement ? `
        await driver.findElement(${configuration.clickOnElement.function}('${configuration.clickOnElement.selector}')).click();
        ` : ''}
        ${configuration.fullPageMode ? `
        eyes.setForceFullPageScreenshot(true);
        ` : ''}
        ${configuration.layoutMode ? `
        const MatchLevel = requireAbs('/test/visual/lib/constants.js').MatchLevel;
        eyes.setMatchLevel(MatchLevel.Layout);
        ` : ''}
        ${configuration.waitOnElement ? `
        waitOnElement = '${configuration.waitOnElement}';
        ` : ''}
        ${configuration.defaultSelectorValue ? `
        waitOnElement = '${configuration.selector.value || configuration.defaultSelectorValue}';
        const webElement = await driver.wait(until.elementLocated(${configuration.selector.function}(waitOnElement)), 30000);
        ` : `
        const webElement = await driver.wait(until.elementLocated(By.css(waitOnElement)), 30000);
        `}
        await driver.wait(until.elementIsVisible(webElement), 30000);
        ${configuration.suppressElement ? `
        await driver.executeScript((webElement) => {
          document.${configuration.suppressElement.documentFunction}(webElement).setAttribute('style', 'display:none');
        }, ['${configuration.suppressElement.documentValue}']);
        ` : ''}
        ${configuration.waitBeforeScreenshot ? `
        await driver.sleep(${configuration.waitBeforeScreenshot});
        ` : ''}
        ${configuration.defaultSelectorValue ? `
        await eyes.check('web-element', Target.region(${configuration.selector.function}('${configuration.selector.value || configuration.defaultSelectorValue}')));
        ` : `
        await eyes.check('viewport', Target.window());
        `}
        await eyes.getRunner().getAllTestResults();
      });
    
      afterEach(async() => {
        await eyes.abortIfNotClosed();
        await driver.quit();
      });
    });  
  `;
};
