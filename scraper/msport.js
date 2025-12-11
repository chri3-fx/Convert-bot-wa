const axios = require("axios");

async function scrapeMsport(code) {
  const url = `https://www.msport.com/api/ng/betslip/share?code=${code}`;

  const { data } = await axios.get(url);

  if (!data || !data.data || !data.data.choices) {
    return [];
  }

  const items = data.data.choices.map(item => ({
    match: item.matchName || null,
    market: item.marketName || null,
    selection: item.optionName || null,
    odd: item.oddValue || null
  }));

  return items;
}

module.exports = scrapeMsport;
