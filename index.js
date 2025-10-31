require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
let urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  const url = req.body.url;
  let hostname;

  try {
    hostname = new URL(url).hostname;
  } catch (err) {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(hostname, (err, address) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      const short_url = urls.length + 1;
      urls.push({ original_url: url, short_url: short_url });
      res.json({ original_url: url, short_url: short_url });
    }
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrlNum = Number(req.params.short_url);
  const urlObj = urls.find(u => u.short_url === shortUrlNum);

  if (urlObj) {
    res.redirect(urlObj.original_url);
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
