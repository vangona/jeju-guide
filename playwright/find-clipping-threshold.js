const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Test viewport sizes around the clipping threshold
    const widths = [400, 380, 360, 350, 340, 330, 325, 320, 315, 310];
    const results = [];

    for (const width of widths) {
      console.log(`\n--- Testing ${width}px width ---`);
      
      await page.setViewportSize({ width: width, height: 600 });
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const analysis = await page.evaluate(() => {
        const honeyTipsLink = document.querySelector('.map-explain__tips');
        const honeyTipsRect = honeyTipsLink ? honeyTipsLink.getBoundingClientRect() : null;
        
        return {
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          honeyTips: honeyTipsRect ? {
            left: honeyTipsRect.left,
            right: honeyTipsRect.right,
            width: honeyTipsRect.width,
            textContent: honeyTipsLink.textContent,
            isClipped: honeyTipsRect.right > window.innerWidth,
            overflowAmount: Math.max(0, honeyTipsRect.right - window.innerWidth)
          } : null
        };
      });

      results.push({
        width: width,
        analysis: analysis
      });

      if (analysis.honeyTips) {
        console.log(`Width: ${width}px`);
        console.log(`HONEY TIPS right edge: ${analysis.honeyTips.right}`);
        console.log(`Viewport width: ${analysis.viewport.width}`);
        console.log(`Clipped: ${analysis.honeyTips.isClipped}`);
        console.log(`Overflow: ${analysis.honeyTips.overflowAmount}px`);
        
        if (analysis.honeyTips.isClipped) {
          console.log(`🚨 CLIPPING DETECTED at ${width}px width!`);
        }
      }
    }

    // Find the exact threshold
    const clippingResults = results.filter(r => r.analysis.honeyTips && r.analysis.honeyTips.isClipped);
    const nonClippingResults = results.filter(r => r.analysis.honeyTips && !r.analysis.honeyTips.isClipped);
    
    if (clippingResults.length > 0 && nonClippingResults.length > 0) {
      const minClippingWidth = Math.min(...clippingResults.map(r => r.width));
      const maxNonClippingWidth = Math.max(...nonClippingResults.map(r => r.width));
      
      console.log(`\n--- CLIPPING THRESHOLD ANALYSIS ---`);
      console.log(`Clipping starts at: ${minClippingWidth}px width`);
      console.log(`Last safe width: ${maxNonClippingWidth}px`);
      console.log(`Threshold range: ${maxNonClippingWidth}px - ${minClippingWidth}px`);
      
      // Get the exact measurements at the threshold
      const thresholdResult = results.find(r => r.width === minClippingWidth);
      if (thresholdResult && thresholdResult.analysis.honeyTips) {
        console.log(`\nAt ${minClippingWidth}px width:`);
        console.log(`  HONEY TIPS element width: ${thresholdResult.analysis.honeyTips.width}px`);
        console.log(`  HONEY TIPS right edge: ${thresholdResult.analysis.honeyTips.right}px`);
        console.log(`  Viewport width: ${thresholdResult.analysis.viewport.width}px`);
        console.log(`  Overflow amount: ${thresholdResult.analysis.honeyTips.overflowAmount}px`);
      }
    }

    // Save results
    require('fs').writeFileSync('clipping-threshold-analysis.json', JSON.stringify(results, null, 2));
    console.log('\nResults saved to clipping-threshold-analysis.json');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();