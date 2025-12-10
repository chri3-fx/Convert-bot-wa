const { chromium } = require("playwright-core");
const path = require("path");

async function scrapeMsport(code) {
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

  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Wait for any betslip structure
  await page.waitForTimeout(3000);

  const bets = await page.evaluate(() => {
    const items = [];

    const selectors = [
      ".coupon-item",
      ".betslip-item",
      ".item",               // backup
      ".match-item",
      ".match-info"
    ];

    let elements = [];
    for (const sel of selectors) {
      const found = document.querySelectorAll(sel);
      if (found.length > 0) {
        elements = found;
        break;
      }
    }

    elements.forEach(el => {
      const match =
        el.querySelector(".match-name")?.innerText?.trim() ||
        el.querySelector(".match")?.innerText?.trim() ||
        el.querySelector(".team-name")?.innerText?.trim() ||
        null;

      const market =
        el.querySelector(".market-name")?.innerText?.trim() ||
        el.querySelector(".market")?.innerText?.trim() ||
        null;

      const selection =
        el.querySelector(".market-option")?.innerText?.trim() ||
        el.querySelector(".option-name")?.innerText?.trim() ||
        null;

      const odd =
        el.querySelector(".odd-num")?.innerText?.trim() ||
        el.querySelector(".odd")?.innerText?.trim() ||
        null;

      items.push({ match, market, selection, odd });
    });

    return items;
  });

  await browser.close();
  return bets;
}

module.exports = scrapeMsport;
