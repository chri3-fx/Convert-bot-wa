const { chromium } = require('playwright');

async function scrapeMsport(code) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-zygote",
      "--disable-software-rasterizer",
      "--single-process"
    ]
  });

  const page = await browser.newPage();

  const url = `https://www.msport.com/ng/?code=${code}&from=share_betslip_wa_app`;

  await page.goto(url, { waitUntil: 'networkidle' });

  // Scrape coupon items
  const bets = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll(".coupon-item").forEach(el => {
      items.push({
        match: el.querySelector(".match-name")?.innerText?.trim() || null,
        market: el.querySelector(".market-name")?.innerText?.trim() || null,
        selection: el.querySelector(".market-option")?.innerText?.trim() || null,
        odd: el.querySelector(".odd-num")?.innerText?.trim() || null,
      });
    });
    return items;
  });

  await browser.close();
  return bets;
}

module.exports = scrapeMsport;
