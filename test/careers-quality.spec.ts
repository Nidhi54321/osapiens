import { test, expect } from '@playwright/test';

test('Careers page should have at least one Quality-related job', async ({ page }) => {
 // Load the careers website
  await page.goto('https://careers.osapiens.com/');
  // Accept cookies if the banner appears
  // Improvement idea: Move this into a reusable helper or global setup
  const acceptCookies = page.getByRole('button', { name: /accept/i });
  if (await acceptCookies.isVisible()) {
    await acceptCookies.click();
  }
    // Locate all job title elements
  // Improvement idea: Use data-testids if available to make selectors more stable
  const jobTitles = page.locator('div.rt-table div[role="row"] a[href*="/postings"] > :nth-child(1)');

  // Wait for the elements to be present in the DOM (even if hidden)
  await jobTitles.first().waitFor({ state: 'attached' });

  // Get the number of open jobs
  const jobCount = await jobTitles.count();

  // Print number of open jobs to console
  console.log(`Number of open jobs: ${jobCount}`);
  // Fail the test immediately if no jobs are listed at all
  // Improvement idea: This could be a separate assertion/test
  expect(jobCount, 'No open jobs found on the careers page').toBeGreaterThan(0);

  // Check if any job title contains the word "Quality"
  let qualityJobFound = false;

  for (let i = 0; i < jobCount; i++) {
    const titleText = (await jobTitles.nth(i).innerText()).toLowerCase();
    if (titleText.includes('quality')) {
      qualityJobFound = true;
      break;
    }
  }

  // Fail the test if no job title contains "Quality"
  // Improvement idea: Consider making the keyword configurable (env or test data)
  expect(
    qualityJobFound,
    'No job title contains the word "Quality"'
  ).toBe(true);

  // Improvement idea: Add screenshots or tracing on failure for easier debugging
  // Improvement idea: Validate job links open correct job detail pages
});
