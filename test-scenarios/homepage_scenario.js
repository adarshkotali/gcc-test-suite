const { findPatientsElement } = require("../page-skeletons/homepage_skeleton");
const { By } = require("selenium-webdriver");

async function navigateToHomePage(driver) {
  try {
    console.log("Navigating to homepage...");

    // Find patients element
    const patientsElement = await findPatientsElement(driver);

    if (patientsElement) {
      await patientsElement.click();
      console.log("Clicked on Patients.");

      // Wait for 3 seconds
      await driver.sleep(3000);

      // Find the div element with class "v-label"
      const pagingStatusElement = await driver.findElement(
        By.css(".v-label-c-paging-status")
      );

      // Get the text content of the element
      const pagingStatusText = await pagingStatusElement.getText();

      // Extract the number from the text (assuming the text is always in the format "{number} rows")
      const rowsCount = parseInt(pagingStatusText.split(" ")[0]);

      // Check if the number of rows is greater than 0
      if (rowsCount > 0) {
        console.log("Rows are present:", rowsCount);
        // Find the parent element with class 'c-grouptable'
        const groupTable = await driver.findElement(
          By.className("c-grouptable")
        );

        // Find the 'First Name' column header within the 'c-grouptable' element
        // Perform the click action for each column header with a 2-second wait after each click
        await checkForOrderChange(driver, groupTable, "First Name");
        await driver.sleep(2000);
        await checkForOrderChange(driver, groupTable, "Last Name");
        await driver.sleep(2000);
        await checkForOrderChange(
          driver,
          groupTable,
          "PID/Internal identifier"
        );
        await driver.sleep(2000);
        await checkForOrderChange(driver, groupTable, "External identifier");
        await driver.sleep(2000);
        await checkForOrderChange(driver, groupTable, "Created By");
      } else {
        console.log("No rows found.");
      }
    } else {
      console.log("Patients element not found.");
    }
  } catch (error) {
    console.error("An error occurred while navigating to the homepage:", error);
  }
}

async function checkForOrderChange(driver, groupTable, columnHeader) {
  const firstNameHeader = await groupTable.findElement(
    By.xpath(
      `.//div[@class='v-table-caption-container v-table-caption-container-align-left' and text()='${columnHeader}']`
    )
  );

  await firstNameHeader.click();

  // Wait for the table to update (you may need to adjust the wait time as needed)
  await driver.sleep(2000);
  const firstNamesBefore = await groupTable.findElements(
    By.xpath(
      ".//td[@class='v-table-cell-content'][position() <= 5]//div[@class='v-table-cell-wrapper']"
    )
  );
  // Retrieve the order of 'First Name' values before the click

  const firstNameValuesBefore = await Promise.all(
    firstNamesBefore.map(async (element) => await element.getText())
  );

  // Find the 'First Name' column header again within the 'c-grouptable' element and click it again
  await firstNameHeader.click();

  // Wait for the table to update again
  await driver.sleep(2000);

  // Retrieve the order of 'First Name' values after the second click
  const firstNamesAfter = await groupTable.findElements(
    By.xpath(
      ".//td[@class='v-table-cell-content'][position() <= 5]//div[@class='v-table-cell-wrapper']"
    )
  );
  const firstNameValuesAfter = await Promise.all(
    firstNamesAfter.map(async (element) => await element.getText())
  );

  // Check if the updated order of 'First Name' values is different from the previous order
  const isDifferent = !firstNameValuesBefore.every(
    (value, index) => value === firstNameValuesAfter[index]
  );

  if (isDifferent) {
    console.log(
      `The order of ${columnHeader} values has changed after clicking.`
    );
  } else {
    console.log(
      `The order of ${columnHeader} values remains the same after clicking.`
    );
  }
}

async function handleSessionExpiredPopup(driver) {
  try {
    // Find the session expired popup
    const sessionExpiredPopup = await driver.findElement(
      By.className("v-Notification-system")
    );

    // Check if session expired popup is visible
    const isPopupVisible = await sessionExpiredPopup.isDisplayed();

    if (isPopupVisible) {
      console.log("Session expired popup is visible.");
      // Click on the popup to handle it
      await sessionExpiredPopup.click();
      console.log("Clicked on the session expired popup.");
      return true;
    } else {
      console.log("Session expired popup is not visible.");
      return false;
    }
  } catch (error) {
    // If the element is not found, it means the popup is not visible
    console.log("Session expired popup is not visible.");
    return false;
  }
}

module.exports = { navigateToHomePage, handleSessionExpiredPopup };
