const { chromium } = require('playwright');

async function scrapeMsport(code) {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  const url = `https://www.msport.com/ng/?code=${code}&from=share_betslip_wa_app`;

  await page.goto(url, { waitUntil: 'networkidle' });

  const bets = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll(".coupon-item").forEach(el => {
      const match = el.querySelector(".match-name")?.innerText?.trim();
      const market = el.querySelector(".market-name")?.innerText?.trim();
      const selection = el.querySelector(".market-option")?.innerText?.trim();
      const odd = el.querySelector(".odd-num")?.innerText?.trim();
      items.push({ match, market, selection, odd });
    });
    return items;
  });

  await browser.close();
  return bets;
}

module.exports = scrapeMsport;
