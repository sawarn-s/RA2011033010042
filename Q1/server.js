const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  if (!urls) {
    return res.status(400).json({ error: 'URLs are required' });
  }

  const urlList = Array.isArray(urls) ? urls : [urls];

  const fetchData = async (url) => {
    try {
      console.log(`Fetching data from ${url}`);
      const response = await axios.get(url);
      console.log(`Data fetched from ${url}:`, response.data);
      return response.data.numbers;
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
      return [];
    }
  };
  

  const fetchDataPromises = urlList.map(fetchData);

  try {
    const results = await Promise.allSettled(fetchDataPromises);
    const mergedNumbers = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value);

    const uniqueSortedNumbers = Array.from(new Set(mergedNumbers)).sort((a, b) => a - b);

    res.json({ numbers: uniqueSortedNumbers });
  } catch (error) {
    console.error(`Error processing data: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
