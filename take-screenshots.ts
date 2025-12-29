import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const screenshotsDir = path.join(process.cwd(), 'screenshots');

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('📸 Starting screenshot capture...');

  // Go to the application
  await page.goto('http://localhost:8081');
  await page.waitForLoadState('networkidle');
  
  // Screenshot 1: Address input with map toggle
  console.log('1. Capturing address input screen...');
  await page.screenshot({ 
    path: path.join(screenshotsDir, '01-address-input.png'),
    fullPage: true 
  });

  // Screenshot 2: Address input with map visible
  console.log('2. Capturing address input with map...');
  const mapButton = page.locator('button').filter({ hasText: /map/i }).first();
  if (await mapButton.count() > 0) {
    await mapButton.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '02-address-with-map.png'),
      fullPage: true 
    });
    await mapButton.click(); // Close map
  }

  // Screenshot 3: Enter address and search
  console.log('3. Entering address...');
  await page.fill('input[placeholder*="address"]', '123 Main Street, New York, NY');
  await page.waitForTimeout(500);
  await page.screenshot({ 
    path: path.join(screenshotsDir, '03-address-entered.png'),
    fullPage: true 
  });

  // Click Find Specialists
  console.log('4. Searching for specialists...');
  await page.click('button:has-text("Find Specialists")');
  await page.waitForTimeout(1500);
  await page.screenshot({ 
    path: path.join(screenshotsDir, '04-searching.png'),
    fullPage: true 
  });

  // Wait for specialists list
  await page.waitForTimeout(2000);
  console.log('5. Capturing specialists list...');
  await page.screenshot({ 
    path: path.join(screenshotsDir, '05-specialists-list.png'),
    fullPage: true 
  });

  // Select first specialist
  console.log('6. Selecting specialist...');
  const firstSpecialist = page.locator('button').filter({ hasText: /select/i }).first();
  if (await firstSpecialist.count() > 0) {
    await firstSpecialist.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '06-tracking-view.png'),
      fullPage: true 
    });

    // Screenshot 7: Wait for specialist to move
    console.log('7. Capturing specialist movement...');
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '07-specialist-moving.png'),
      fullPage: true 
    });

    // Screenshot 8: Open call dialog
    console.log('8. Opening call dialog...');
    const callButton = page.locator('button:has-text("Call")');
    if (await callButton.count() > 0) {
      await callButton.click();
      await page.waitForTimeout(2500);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '08-call-dialog.png'),
        fullPage: true 
      });

      // Close call dialog using Escape key
      console.log('   Closing call dialog...');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
    }

    // Screenshot 9: Open message dialog
    console.log('9. Opening message dialog...');
    const messageButton = page.locator('button:has-text("Message")');
    if (await messageButton.count() > 0) {
      await messageButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '09-message-dialog.png'),
        fullPage: true 
      });

      // Send a message
      console.log('10. Sending a message...');
      const messageInput = page.locator('input[placeholder*="message"]');
      await messageInput.fill('Hello! When will you arrive?');
      await page.waitForTimeout(300);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '10-message-typing.png'),
        fullPage: true 
      });

      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500); // Wait for auto-reply
      await page.screenshot({ 
        path: path.join(screenshotsDir, '11-message-conversation.png'),
        fullPage: true 
      });
    }
  }

  console.log('✅ All screenshots captured successfully!');
  console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

  await browser.close();
}

takeScreenshots().catch(console.error);
