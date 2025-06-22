const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Test progressively smaller viewport sizes
    const viewports = [
      { width: 800, height: 600, name: '800x600' },
      { width: 768, height: 1024, name: '768x1024' },
      { width: 480, height: 800, name: '480x800' },
      { width: 375, height: 667, name: '375x667' },
      { width: 320, height: 568, name: '320x568' }
    ];

    for (const viewport of viewports) {
      console.log(`\n--- Testing ${viewport.name} ---`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      // Analyze the HONEY TIPS text and navigation layout
      const analysis = await page.evaluate(() => {
        // Find the navigation container
        const navContainer = document.querySelector('.nav__container');
        const navRect = navContainer ? navContainer.getBoundingClientRect() : null;
        
        // Find the HONEY TIPS link
        const honeyTipsLink = document.querySelector('.map-explain__tips');
        const honeyTipsRect = honeyTipsLink ? honeyTipsLink.getBoundingClientRect() : null;
        
        // Find all navigation items
        const navItems = Array.from(document.querySelectorAll('.nav__container *')).map(el => {
          const rect = el.getBoundingClientRect();
          return {
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent.trim(),
            position: {
              top: rect.top,
              left: rect.left,
              bottom: rect.bottom,
              right: rect.right,
              width: rect.width,
              height: rect.height
            },
            isClipped: rect.right > window.innerWidth || rect.left < 0,
            overflowAmount: Math.max(0, rect.right - window.innerWidth)
          };
        }).filter(item => item.textContent.length > 0);

        return {
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          navigation: {
            container: navRect ? {
              position: navRect,
              isClipped: navRect.right > window.innerWidth || navRect.left < 0,
              overflowAmount: Math.max(0, navRect.right - window.innerWidth)
            } : null,
            items: navItems
          },
          honeyTips: {
            found: !!honeyTipsLink,
            element: honeyTipsRect ? {
              position: honeyTipsRect,
              isClipped: honeyTipsRect.right > window.innerWidth || honeyTipsRect.left < 0,
              overflowAmount: Math.max(0, honeyTipsRect.right - window.innerWidth),
              textContent: honeyTipsLink.textContent
            } : null
          }
        };
      });

      // Take full screenshot
      await page.screenshot({
        path: `screenshots/viewport-test-${viewport.name}.png`,
        fullPage: true
      });

      // Take focused screenshot of bottom navigation area
      await page.screenshot({
        path: `screenshots/nav-focus-${viewport.name}.png`,
        clip: {
          x: 0,
          y: Math.max(0, viewport.height - 100),
          width: viewport.width,
          height: 100
        }
      });

      console.log(`Viewport: ${analysis.viewport.width}x${analysis.viewport.height}`);
      
      if (analysis.navigation.container) {
        console.log(`Navigation container: ${analysis.navigation.container.position.left} to ${analysis.navigation.container.position.right}`);
        console.log(`Navigation clipped: ${analysis.navigation.container.isClipped} (overflow: ${analysis.navigation.container.overflowAmount}px)`);
      }
      
      if (analysis.honeyTips.found) {
        console.log(`HONEY TIPS: "${analysis.honeyTips.element.textContent}"`);
        console.log(`HONEY TIPS position: ${analysis.honeyTips.element.position.left} to ${analysis.honeyTips.element.position.right}`);
        console.log(`HONEY TIPS clipped: ${analysis.honeyTips.element.isClipped} (overflow: ${analysis.honeyTips.element.overflowAmount}px)`);
      }

      // Check for clipped navigation items
      const clippedItems = analysis.navigation.items.filter(item => item.isClipped);
      if (clippedItems.length > 0) {
        console.log(`🚨 ${clippedItems.length} navigation items are clipped:`);
        clippedItems.forEach(item => {
          console.log(`  - "${item.textContent}" (${item.tagName}.${item.className}) overflow: ${item.overflowAmount}px`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();