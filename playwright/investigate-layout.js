const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Launch browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Define viewport sizes to test
  const viewportSizes = [
    { width: 1920, height: 1080, name: 'desktop-1920x1080' },
    { width: 1366, height: 768, name: 'desktop-1366x768' },
    { width: 1024, height: 768, name: 'tablet-1024x768' }
  ];

  const results = [];

  try {
    for (const viewport of viewportSizes) {
      console.log(`\n--- Testing ${viewport.name} (${viewport.width}x${viewport.height}) ---`);
      
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Navigate to the page
      console.log('Navigating to http://localhost:3000...');
      await page.goto('http://localhost:3000', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });

      // Wait for content to load
      console.log('Waiting for content to load...');
      await page.waitForTimeout(3000);

      // Get actual viewport size
      const actualViewport = await page.evaluate(() => {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight
        };
      });

      console.log(`Actual viewport: ${actualViewport.width}x${actualViewport.height}`);
      console.log(`Document size: ${actualViewport.scrollWidth}x${actualViewport.scrollHeight}`);

      // Check for HONEY TIPS section
      const honeyTipsInfo = await page.evaluate(() => {
        const honeyTipsElement = document.querySelector('[data-testid="honey-tips"], .honey-tips') || 
                                document.evaluate("//h2[contains(text(), 'HONEY TIPS')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        if (!honeyTipsElement) {
          // Try alternative selectors
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
          const honeyTipsHeading = headings.find(h => h.textContent.includes('HONEY TIPS') || h.textContent.includes('꿀팁'));
          
          if (honeyTipsHeading) {
            const rect = honeyTipsHeading.getBoundingClientRect();
            return {
              found: true,
              element: 'heading',
              text: honeyTipsHeading.textContent,
              position: {
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right,
                width: rect.width,
                height: rect.height
              },
              offsetTop: honeyTipsHeading.offsetTop,
              scrollTop: window.scrollY
            };
          }
        } else {
          const rect = honeyTipsElement.getBoundingClientRect();
          return {
            found: true,
            element: 'direct',
            text: honeyTipsElement.textContent,
            position: {
              top: rect.top,
              left: rect.left,
              bottom: rect.bottom,
              right: rect.right,
              width: rect.width,
              height: rect.height
            },
            offsetTop: honeyTipsElement.offsetTop,
            scrollTop: window.scrollY
          };
        }
        
        return { found: false };
      });

      // Check for navigation elements
      const navigationInfo = await page.evaluate(() => {
        const navElements = document.querySelectorAll('nav, .navigation, .nav, [role="navigation"]');
        const results = [];
        
        navElements.forEach((nav, index) => {
          const rect = nav.getBoundingClientRect();
          results.push({
            index,
            tagName: nav.tagName,
            className: nav.className,
            position: {
              top: rect.top,
              left: rect.left,
              bottom: rect.bottom,
              right: rect.right,
              width: rect.width,
              height: rect.height
            },
            offsetTop: nav.offsetTop,
            zIndex: window.getComputedStyle(nav).zIndex,
            position_style: window.getComputedStyle(nav).position
          });
        });
        
        return results;
      });

      // Check for any elements with fixed positioning that might cause overlap
      const fixedElements = await page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        const fixedElements = [];
        
        allElements.forEach((el, index) => {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'sticky') {
            const rect = el.getBoundingClientRect();
            fixedElements.push({
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              position: style.position,
              zIndex: style.zIndex,
              bounds: {
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right,
                width: rect.width,
                height: rect.height
              }
            });
          }
        });
        
        return fixedElements;
      });

      // Take full page screenshot
      const screenshotPath = `screenshots/layout-investigation-${viewport.name}.png`;
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true
      });

      // Take screenshot of bottom area if HONEY TIPS section is found
      let bottomScreenshotPath = null;
      if (honeyTipsInfo.found) {
        // Scroll to HONEY TIPS section
        await page.evaluate((offsetTop) => {
          window.scrollTo(0, offsetTop - 200); // Scroll with some margin
        }, honeyTipsInfo.offsetTop);
        
        await page.waitForTimeout(1000);
        
        bottomScreenshotPath = `screenshots/bottom-area-${viewport.name}.png`;
        await page.screenshot({ 
          path: bottomScreenshotPath,
          clip: {
            x: 0,
            y: Math.max(0, honeyTipsInfo.position.top - 100),
            width: viewport.width,
            height: Math.min(viewport.height, 600)
          }
        });
      }

      // Store results
      results.push({
        viewport: viewport,
        actualViewport: actualViewport,
        honeyTipsInfo: honeyTipsInfo,
        navigationInfo: navigationInfo,
        fixedElements: fixedElements,
        screenshots: {
          fullPage: screenshotPath,
          bottomArea: bottomScreenshotPath
        }
      });

      console.log(`Screenshots saved for ${viewport.name}`);
      if (honeyTipsInfo.found) {
        console.log(`HONEY TIPS found at position: top=${honeyTipsInfo.position.top}, bottom=${honeyTipsInfo.position.bottom}`);
      } else {
        console.log('HONEY TIPS section not found');
      }
      console.log(`Found ${navigationInfo.length} navigation elements`);
      console.log(`Found ${fixedElements.length} fixed/sticky positioned elements`);
    }

    // Save detailed results to JSON file
    fs.writeFileSync('layout-investigation-results.json', JSON.stringify(results, null, 2));
    console.log('\n--- Investigation Complete ---');
    console.log('Detailed results saved to layout-investigation-results.json');
    
    // Print summary
    console.log('\n--- SUMMARY ---');
    results.forEach(result => {
      console.log(`\n${result.viewport.name}:`);
      console.log(`  Viewport: ${result.actualViewport.width}x${result.actualViewport.height}`);
      console.log(`  Document: ${result.actualViewport.scrollWidth}x${result.actualViewport.scrollHeight}`);
      console.log(`  HONEY TIPS: ${result.honeyTipsInfo.found ? 'Found' : 'Not Found'}`);
      if (result.honeyTipsInfo.found) {
        console.log(`    Position: top=${result.honeyTipsInfo.position.top}, bottom=${result.honeyTipsInfo.position.bottom}`);
      }
      console.log(`  Navigation elements: ${result.navigationInfo.length}`);
      console.log(`  Fixed/sticky elements: ${result.fixedElements.length}`);
      
      // Check for potential overlaps
      if (result.honeyTipsInfo.found && result.fixedElements.length > 0) {
        const overlaps = result.fixedElements.filter(fixedEl => {
          return (fixedEl.bounds.top < result.honeyTipsInfo.position.bottom && 
                  fixedEl.bounds.bottom > result.honeyTipsInfo.position.top);
        });
        if (overlaps.length > 0) {
          console.log(`  ⚠️  Potential overlaps detected: ${overlaps.length} elements`);
          overlaps.forEach(overlap => {
            console.log(`     - ${overlap.tagName}.${overlap.className} (${overlap.position})`);
          });
        }
      }
    });

  } catch (error) {
    console.error('Error during investigation:', error);
  } finally {
    await browser.close();
  }
})();