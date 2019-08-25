'use strict';

module.exports = (configuration) => {
  return `
    'use strict';

    const {By, Target} = requireAbs('/test/visual/lib/constants.js');
    let utils = requireAbs('/test/visual/lib/utils.js');
    ${configuration.scrollToViewElement ? `
    const until = requireAbs('/test/visual/lib/constants.js').until;
    ` : ''}
    
    describe('visual test', () => {
      let driver, // @type {WebDriver}
          eyes, // @type {Eyes}
          testName,
          baseUrl = 'https://dev-uw.usatoday.com';
    
      beforeEach(async() => {
        driver = await utils.remoteDriverInit();
        eyes = await utils.eyesLegacyInit();
        await driver.get(baseUrl + '${configuration.urlEnding}');
      });
    
      testName = test('${configuration.name}', async() => {
        await eyes.open(driver, global.appName, testName.description);
        ${configuration.scrollToViewElement ? `
        await driver.wait(until.elementLocated(${configuration.scrollToViewElement.function}('${configuration.scrollToViewElement.value || configuration.defaultSelectorValue}')), 30000);
        await driver.executeScript((pageElement) => {
          let targetElement = document.${configuration.scrollToViewElement.documentFunction}(pageElement),
              headerElement = document.querySelector('nav-global');
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
        ${configuration.waitBeforeScreenshot ? `
        await driver.sleep(${configuration.waitBeforeScreenshot});
        // TODO: figure out a better solution for lazy loading
        ` : ''}
        ${configuration.defaultSelectorValue ? `
        await eyes.check('web-element', Target.region(${configuration.selector.function}('${configuration.selector.value || configuration.defaultSelectorValue}')));
        ` : `
        await eyes.check('viewport', Target.window());
        `}
        await utils.validateLegacyResult(eyes);
      });
    
      afterEach(async() => {
        await eyes.abortIfNotClosed();
        await utils.updateSauce(driver, testName.description, testName.status());
        await driver.quit();
      });
    });  
  `;
};
