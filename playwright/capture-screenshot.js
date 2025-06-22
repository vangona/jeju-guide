const { chromium } = require('playwright');

(async () => {
  // Launch browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to capture full content
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    // Navigate to the page
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Wait for the map and content to load
    console.log('Waiting for content to load...');
    await page.waitForTimeout(3000);

    // Take a full page screenshot
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: 'home-screen-current.png',
      fullPage: true
    });

    console.log('Screenshot saved as home-screen-current.png');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();