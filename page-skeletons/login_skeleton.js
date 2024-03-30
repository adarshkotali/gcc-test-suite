const { By } = require("selenium-webdriver");

async function findLoginField(driver) {
  return await driver.findElement(By.name("loginField"));
}

async function findPasswordField(driver) {
  return await driver.findElement(By.name("passwordField"));
}

async function findLoginButton(driver) {
  return await driver.findElement(By.className("c-login-submit-button"));
}

module.exports = {
  findLoginField: findLoginField,
  findPasswordField: findPasswordField,
  findLoginButton: findLoginButton,
};
