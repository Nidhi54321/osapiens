import { test, expect } from '@playwright/test';
//Improvement idea: Page object model and data-driven can be used for better structure and reusability
//Improvement idea: add retries for flaky tests in the config file
//Improvement idea: Use cucumber or BDD style for better readability of test cases or for involving stakeholders
test('@smoke :Careers page should have at least one Quality-related job', async ({ page }) => {
  //Step-1: Loads the website
  //Improvement idea: url can be moved to config or env variable for better flexibility
  await page.goto('https://careers.osapiens.com/');
  // Improvement idea: we can use page.locator('button[data-role="all"]') as it has data attribute, below selector uses accessibility tree, making tests closer to real user interactions and more resilient to DOM change
  const acceptCookies = page.getByRole('button', { name: /accept/i });
  if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
  // Improvement idea: Use ids or data-testids to make CSS selectors more stable
  const jobTitles = page.locator('div.rt-table div[role="row"] a[href*="/postings"] > :nth-child(1)');
  // Wait for the elements to be present in the DOM (even if hidden)
  await jobTitles.first().waitFor({ state: 'attached' });
  const jobCount = await jobTitles.count();

  //Step-2: Prints the number of open jobs
  console.log(`Number of open jobs: ${jobCount}`);
  expect(jobCount, 'No open jobs found on the careers page').toBeGreaterThan(0);

  //Step-3: Checks and fails the test if none of the job titles contains “Quality”
  // avoided for loop and used filter method for better performance and cleaner code  
  const qualityJobCount = await jobTitles.filter({ hasText: /Quality/i }).count();
  expect(qualityJobCount,'No job title contains the word "Quality"').toBeGreaterThan(0);
});

// Adding hook to capture full page screenshots and logs on failure for easier debugging
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `test-results/failure-${testInfo.title}-${timestamp}.png`,
      fullPage: true 
    });
  }
});