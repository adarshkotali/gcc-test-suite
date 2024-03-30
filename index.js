const { Builder } = require("selenium-webdriver");
const loginScenario = require("./test-scenarios/login_scenario");
const {
  navigateToHomePage,
  handleSessionExpiredPopup,
} = require("./test-scenarios/homepage_scenario");

async function runTests() {
  let driver;
  try {
    console.log("Initializing WebDriver...");
    driver = await new Builder().forBrowser("firefox").build();

    // Define test data
    const username = "d_user";
    const password = "demo";
    const url = "https://services.genetico.in:8084/#login";

    await driver.get(url);

    console.log("Starting login scenario...");

    // Run login scenario
    await loginScenario(driver, username, password);

    console.log("Starting homepage scenario...");
    const isExpirePopupVisible = await handleSessionExpiredPopup(driver);
    if (isExpirePopupVisible) {
      runTests();
    }
    await navigateToHomePage(driver);

    console.log("Tests completed successfully.");
  } catch (error) {
    console.error("An error occurred while running tests:", error);
  } finally {
    if (driver) {
      console.log("Quitting WebDriver...");
      await driver.quit();
    }
  }
}

runTests();
