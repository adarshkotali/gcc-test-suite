const { By } = require("selenium-webdriver");

async function findPatientsElement(driver) {
  try {
    // Find all elements with class ".c-sidemenu-item-caption"
    const elements = await driver.findElements(
      By.css(".c-sidemenu-item-caption")
    );

    let patientsElement;

    // Iterate over all elements and find the one with text content equal to "Patients"
    for (const element of elements) {
      const text = await element.getText();
      if (text === "Patients") {
        patientsElement = element;
        break; // Exit the loop once found
      }
    }

    return patientsElement;
  } catch (error) {
    console.error("An error occurred while finding patients element:", error);
    throw error;
  }
}

module.exports = {
  findPatientsElement,
};
