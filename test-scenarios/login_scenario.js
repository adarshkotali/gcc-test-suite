//1.test if login is visible
//2. check passowrd correct or incorrect
//3. If correct proceed or if incorrect break
const {
  findLoginField,
  findPasswordField,
  findLoginButton,
} = require("../page-skeletons/login_skeleton");

async function isLoginVisible(driver) {
  try {
    const loginField = await findLoginField(driver);
    const isLoginFieldDisplayed = await loginField.isDisplayed();
    return isLoginFieldDisplayed;
  } catch (error) {
    console.error("An error occurred while checking login visibility:", error);
    return false;
  }
}

async function checkPassword(driver, username, password) {
  try {
    console.log("Logging in...");
    const loginField = await findLoginField(driver);
    const passwordField = await findPasswordField(driver);
    const loginButton = await findLoginButton(driver);

    await loginField.sendKeys(username);
    await passwordField.sendKeys(password);
    await loginButton.click();

    // Check if login is successful or not
    await driver.sleep(2000); // Adjust wait time as needed
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("#login")) {
      console.log("Login failed. Incorrect username or password.");
      return false;
    } else {
      console.log("Login successful.");
      return true;
    }
  } catch (error) {
    console.error("An error occurred during login:", error);
    return false;
  }
}

async function loginScenario(driver, username, password) {
  try {
    console.log("Checking if login form is visible...");
    const isLoginVisibleResult = await isLoginVisible(driver);
    if (!isLoginVisibleResult) {
      console.log("Login form is not visible.");
      return;
    }

    console.log("Login form is visible.");
    const isPasswordCorrect = await checkPassword(driver, username, password);
    if (!isPasswordCorrect) {
      console.log("Exiting login scenario due to incorrect password.");
      return;
    }

    // Proceed with additional steps after successful login
    console.log("Proceeding with additional steps after successful login...");
  } catch (error) {
    console.error("An error occurred during login scenario:", error);
  }
}

module.exports = loginScenario;
