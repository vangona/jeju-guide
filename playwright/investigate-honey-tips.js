const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const results = [];

  try {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: '1920x1080' },
      { width: 1366, height: 768, name: '1366x768' },
      { width: 1024, height: 768, name: '1024x768' }
    ];

    for (const viewport of viewports) {
      console.log(`\n--- Testing ${viewport.name} ---`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      // Look for the "HONEY TIPS" text specifically
      const honeyTipsAnalysis = await page.evaluate(() => {
        // Find all text nodes that contain "HONEY TIPS" or "EY TIPS"
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
          if (node.textContent.includes('HONEY TIPS') || node.textContent.includes('EY TIPS')) {
            const parent = node.parentElement;
            const rect = parent.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(parent);
            
            textNodes.push({
              text: node.textContent,
              parentTag: parent.tagName,
              parentClass: parent.className,
              parentId: parent.id,
              position: {
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right,
                width: rect.width,
                height: rect.height
              },
              isVisible: rect.width > 0 && rect.height > 0,
              isInViewport: rect.top >= 0 && rect.left >= 0 && 
                           rect.bottom <= window.innerHeight && 
                           rect.right <= window.innerWidth,
              overflow: computedStyle.overflow,
              textOverflow: computedStyle.textOverflow,
              whiteSpace: computedStyle.whiteSpace,
              fontSize: computedStyle.fontSize,
              fontFamily: computedStyle.fontFamily,
              color: computedStyle.color,
              backgroundColor: computedStyle.backgroundColor,
              zIndex: computedStyle.zIndex,
              position_style: computedStyle.position
            });
          }
        }
        
        return {
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          textNodes: textNodes,
          documentSize: {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight
          }
        };
      });

      // Take screenshot focused on bottom area
      const bottomScreenshot = `screenshots/honey-tips-focus-${viewport.name}.png`;
      await page.screenshot({
        path: bottomScreenshot,
        clip: {
          x: 0,
          y: Math.max(0, viewport.height - 200),
          width: viewport.width,
          height: 200
        }
      });

      results.push({
        viewport: viewport,
        analysis: honeyTipsAnalysis,
        screenshot: bottomScreenshot
      });

      console.log(`Found ${honeyTipsAnalysis.textNodes.length} HONEY TIPS text nodes`);
      honeyTipsAnalysis.textNodes.forEach((node, index) => {
        console.log(`  ${index + 1}. "${node.text}" in ${node.parentTag}.${node.parentClass}`);
        console.log(`     Position: ${node.position.left}, ${node.position.top}, ${node.position.right}, ${node.position.bottom}`);
        console.log(`     In viewport: ${node.isInViewport}, Visible: ${node.isVisible}`);
        console.log(`     Right edge at: ${node.position.right}, Viewport width: ${honeyTipsAnalysis.viewport.width}`);
        if (node.position.right > honeyTipsAnalysis.viewport.width) {
          console.log(`     ⚠️  TEXT IS CLIPPED! Right edge (${node.position.right}) exceeds viewport width (${honeyTipsAnalysis.viewport.width})`);
        }
      });
    }

    // Save detailed results
    require('fs').writeFileSync('honey-tips-analysis.json', JSON.stringify(results, null, 2));
    console.log('\n--- Analysis Complete ---');
    console.log('Results saved to honey-tips-analysis.json');
    console.log('Screenshots saved in screenshots/ directory');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();