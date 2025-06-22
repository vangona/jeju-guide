const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Test at critical viewports
    const testViewports = [
      { width: 340, height: 600, name: 'safe-width' },
      { width: 330, height: 600, name: 'clipping-starts' },
      { width: 320, height: 568, name: 'iphone-se' }
    ];

    for (const viewport of testViewports) {
      console.log(`\n=== ${viewport.name.toUpperCase()} (${viewport.width}x${viewport.height}) ===`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const detailedAnalysis = await page.evaluate(() => {
        // Get navigation container details
        const navContainer = document.querySelector('.nav__container');
        const navContainerStyle = navContainer ? window.getComputedStyle(navContainer) : null;
        const navContainerRect = navContainer ? navContainer.getBoundingClientRect() : null;

        // Get HONEY TIPS element details
        const honeyTipsElement = document.querySelector('.map-explain__tips');
        const honeyTipsStyle = honeyTipsElement ? window.getComputedStyle(honeyTipsElement) : null;
        const honeyTipsRect = honeyTipsElement ? honeyTipsElement.getBoundingClientRect() : null;

        // Get all navigation items with their styles
        const navItems = Array.from(document.querySelectorAll('.nav__container *')).map(el => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent.trim(),
            styles: {
              position: style.position,
              display: style.display,
              width: style.width,
              minWidth: style.minWidth,
              maxWidth: style.maxWidth,
              padding: style.padding,
              margin: style.margin,
              fontSize: style.fontSize,
              overflow: style.overflow,
              textOverflow: style.textOverflow,
              whiteSpace: style.whiteSpace,
              flexShrink: style.flexShrink,
              flexGrow: style.flexGrow,
              flexBasis: style.flexBasis
            },
            position: {
              top: rect.top,
              left: rect.left,
              bottom: rect.bottom,
              right: rect.right,
              width: rect.width,
              height: rect.height
            },
            isClipped: rect.right > window.innerWidth || rect.left < 0
          };
        }).filter(item => item.textContent.length > 0);

        return {
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          navigation: {
            container: navContainer ? {
              styles: {
                position: navContainerStyle.position,
                bottom: navContainerStyle.bottom,
                left: navContainerStyle.left,
                right: navContainerStyle.right,
                width: navContainerStyle.width,
                height: navContainerStyle.height,
                display: navContainerStyle.display,
                justifyContent: navContainerStyle.justifyContent,
                alignItems: navContainerStyle.alignItems,
                padding: navContainerStyle.padding,
                margin: navContainerStyle.margin,
                zIndex: navContainerStyle.zIndex,
                backgroundColor: navContainerStyle.backgroundColor,
                borderRadius: navContainerStyle.borderRadius
              },
              position: {
                top: navContainerRect.top,
                left: navContainerRect.left,
                bottom: navContainerRect.bottom,
                right: navContainerRect.right,
                width: navContainerRect.width,
                height: navContainerRect.height
              }
            } : null,
            items: navItems
          },
          honeyTips: honeyTipsElement ? {
            styles: {
              position: honeyTipsStyle.position,
              display: honeyTipsStyle.display,
              width: honeyTipsStyle.width,
              padding: honeyTipsStyle.padding,
              margin: honeyTipsStyle.margin,
              fontSize: honeyTipsStyle.fontSize,
              color: honeyTipsStyle.color,
              backgroundColor: honeyTipsStyle.backgroundColor,
              borderRadius: honeyTipsStyle.borderRadius,
              textAlign: honeyTipsStyle.textAlign,
              overflow: honeyTipsStyle.overflow,
              textOverflow: honeyTipsStyle.textOverflow,
              whiteSpace: honeyTipsStyle.whiteSpace
            },
            position: {
              top: honeyTipsRect.top,
              left: honeyTipsRect.left,
              bottom: honeyTipsRect.bottom,
              right: honeyTipsRect.right,
              width: honeyTipsRect.width,
              height: honeyTipsRect.height
            },
            textContent: honeyTipsElement.textContent,
            isClipped: honeyTipsRect.right > window.innerWidth
          } : null
        };
      });

      // Take screenshot
      await page.screenshot({
        path: `screenshots/final-report-${viewport.name}.png`,
        fullPage: true
      });

      // Report findings
      console.log(`Viewport: ${detailedAnalysis.viewport.width}x${detailedAnalysis.viewport.height}`);
      
      if (detailedAnalysis.navigation.container) {
        console.log(`\nNavigation Container:`);
        console.log(`  Position: ${detailedAnalysis.navigation.container.styles.position}`);
        console.log(`  Dimensions: ${detailedAnalysis.navigation.container.position.width}x${detailedAnalysis.navigation.container.position.height}`);
        console.log(`  Location: left=${detailedAnalysis.navigation.container.position.left}, right=${detailedAnalysis.navigation.container.position.right}`);
        console.log(`  Display: ${detailedAnalysis.navigation.container.styles.display}`);
        console.log(`  Justify Content: ${detailedAnalysis.navigation.container.styles.justifyContent}`);
      }

      if (detailedAnalysis.honeyTips) {
        console.log(`\nHONEY TIPS Element:`);
        console.log(`  Text: "${detailedAnalysis.honeyTips.textContent}"`);
        console.log(`  Dimensions: ${detailedAnalysis.honeyTips.position.width}x${detailedAnalysis.honeyTips.position.height}`);
        console.log(`  Location: left=${detailedAnalysis.honeyTips.position.left}, right=${detailedAnalysis.honeyTips.position.right}`);
        console.log(`  Font Size: ${detailedAnalysis.honeyTips.styles.fontSize}`);
        console.log(`  Padding: ${detailedAnalysis.honeyTips.styles.padding}`);
        console.log(`  Text Overflow: ${detailedAnalysis.honeyTips.styles.textOverflow}`);
        console.log(`  White Space: ${detailedAnalysis.honeyTips.styles.whiteSpace}`);
        console.log(`  Clipped: ${detailedAnalysis.honeyTips.isClipped}`);
        
        if (detailedAnalysis.honeyTips.isClipped) {
          const overflow = detailedAnalysis.honeyTips.position.right - detailedAnalysis.viewport.width;
          console.log(`  🚨 OVERFLOW: ${overflow.toFixed(2)}px beyond viewport`);
        }
      }

      const clippedItems = detailedAnalysis.navigation.items.filter(item => item.isClipped);
      if (clippedItems.length > 0) {
        console.log(`\n🚨 ${clippedItems.length} clipped navigation items:`);
        clippedItems.forEach(item => {
          const overflow = item.position.right - detailedAnalysis.viewport.width;
          console.log(`  - "${item.textContent}" (${item.tagName}.${item.className}): ${overflow.toFixed(2)}px overflow`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();