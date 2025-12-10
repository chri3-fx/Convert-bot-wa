const express = require('express');
const scrapeMsport = require('./scraper/msport');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send("MSport Converter API is running");
});

app.get('/decode/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const results = await scrapeMsport(code);
    res.json({ success: true, results });
  } catch (error) {
    res.json({ success: false, error: error.toString() });
  }
});

// ✅ IMPORTANT FIX FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
