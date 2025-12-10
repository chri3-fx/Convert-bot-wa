const { chromium } = require("playwright-core");
const path = require("path");

async function scrapeMsport(code) {
  const chromePath = path.join(__dirname, ".cache", "chrome", "linux-*/chrome");

  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage"
    ]
  });

  const page = await browser.newPage();
  const url = `https://www.msport.com/ng/?code=${code}`;
  await page.goto(url, { waitUntil: "networkidle" });

  const bets = await page.evaluate(() => {
    const output = [];
    document.querySelectorAll(".coupon-item").forEach(el => {
      output.push({
        match: el.querySelector(".match-name")?.innerText ?? null,
        market: el.querySelector(".market-name")?.innerText ?? null,
        selection: el.querySelector(".market-option")?.innerText ?? null,
        odd: el.querySelector(".odd-num")?.innerText ?? null,
      });
    });
    return output;
  });

  await browser.close();
  return bets;
}

module.exports = scrapeMsport;
