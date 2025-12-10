const { chromium } = require('playwright');

async function scrapeMsport(code) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--no-zygote",
      "--single-process"
    ]
  });

  const page = await browser.newPage();

  const url = `https://www.msport.com/ng/?code=${code}&from=share_betslip_wa_app`;

  await page.goto(url, { waitUntil: 'networkidle' });

  const bets = await page.evaluate(() => {
    const output = [];

    const items = document.querySelectorAll(".coupon-item");
    items.forEach(el => {
      output.push({
        match: el.querySelector(".match-name")?.innerText?.trim() || "",
        market: el.querySelector(".market-name")?.innerText?.trim() || "",
        selection: el.querySelector(".market-option")?.innerText?.trim() || "",
        odd: el.querySelector(".odd-num")?.innerText?.trim() || "",
      });
    });

    return output;
  });

  await browser.close();
  return bets;
}

module.exports = scrapeMsport;
