const { chromium } = require("playwright-core");
const path = require("path");

async function scrapeMsport(code) {
  // Correct Chrome path from Render logs
  const chromePath = path.join(
    __dirname,
    "..",
    ".local-chrome",
    "chrome",
    "linux-143.0.7499.42",
    "chrome-linux64",
    "chrome"
  );

  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-setuid-sandbox"
    ]
  });

  const page = await browser.newPage();
  const url = `https://www.msport.com/ng/?code=${code}&from=share_betslip_wa_app`;

  await page.goto(url, { waitUntil: "networkidle" });

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
