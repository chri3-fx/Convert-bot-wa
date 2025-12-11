const { chromium } = require("playwright");

async function scrapeMsport(code) {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/opt/render/project/.local-chrome/chrome/linux-143.0.7499.42/chrome-linux64/chrome",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled"
    ]
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  const url = `https://www.msport.com/ng/?code=${code}&from=share_betslip_wa_app`;
  
  await page.goto(url, { waitUntil: "networkidle" });

  // Wait for coupon items to load
  await page.waitForSelector(".coupon-item", { timeout: 8000 }).catch(() => {});

  const items = await page.evaluate(() => {
    const bets = [];
    document.querySelectorAll(".coupon-item").forEach(el => {
      bets.push({
        match: el.querySelector(".match-name")?.innerText?.trim() || null,
        market: el.querySelector(".market-name")?.innerText?.trim() || null,
        selection: el.querySelector(".market-option")?.innerText?.trim() || null,
        odd: el.querySelector(".odd-num")?.innerText?.trim() || null
      });
    });
    return bets;
  });

  await browser.close();
  return items;
}

module.exports = scrapeMsport;
