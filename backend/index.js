const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csvParser = require('csv-parser');
const { Readable } = require('stream');

const app = express();
app.use(cors());

let latestMarketData = [];

// Replace this with the real AGMARKNET CSV URL for daily prices
const agmarknetCSVUrl =
  'https://agmarknet.gov.in/some-daily-price-file.csv';

// Function to download and parse CSV
async function updateMarketData() {
  try {
    console.log('Updating AGMARKNET market data...');
    const response = await axios.get(agmarknetCSVUrl);
    const csvData = response.data;

    const results = [];
    const stream = Readable.from(csvData);

    return new Promise((resolve, reject) => {
      let headersPrinted = false;

      stream
        .pipe(csvParser())
        .on('data', (row) => {
          // Normalize CSV keys for safety
          const normalized = {};
          for (const key in row) {
            const cleanKey = key.replace(/\ufeff/g, '').trim().toLowerCase();
            normalized[cleanKey] = (row[key] || '').trim();
          }

          if (!headersPrinted) {
            console.log('Detected headers:', Object.keys(normalized));
            headersPrinted = true;
          }

          // Detect the modal price column dynamically
          const priceKey = Object.keys(normalized).find((k) =>
            k.includes('modal') && k.includes('price')
          );

          let priceValue = 0;
          if (priceKey && normalized[priceKey]) {
            priceValue = parseFloat(normalized[priceKey]) || 0;
          }

          results.push({
            crop: normalized['commodity'] || '',
            price: priceValue,
            market: normalized['market'] || '',
            date:
              normalized['arrival date'] ||
              normalized['date'] ||
              '',
            unit: normalized['unit'] || '₹/quintal',
          });
        })
        .on('end', () => {
          // OPTIONAL: Filter the crops you care about
          latestMarketData = results.filter((item) =>
            ['wheat', 'rice', 'sugar', 'cotton', 'coffee'].includes(
              item.crop.toLowerCase()
            )
          );

          console.log(
            `AGMARKNET data updated: ${latestMarketData.length} relevant entries`
          );
          resolve();
        })
        .on('error', (err) => {
          console.error('CSV parse error:', err);
          reject(err);
        });
    });
  } catch (error) {
    console.error(
      'Failed to update market data:',
      error.message
    );
  }
}

// Initial update + schedule every 24h
setInterval(updateMarketData, 24 * 60 * 60 * 1000);
updateMarketData();

app.get('/market-prices', (req, res) => {
  res.json(latestMarketData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Market data backend running on port ${PORT}`);
});