require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Middleware for bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

<br />
// Array for urls
let urls = [];

// POST for shorturl
app.post('/api/shorturl', (req, res) => {
  let url = req.body.url;
  dns.lookup(new URL(url).hostname, (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' })
    }
    else {
      if (!urls.includes(url)) {
        urls.push(url);
        res.json({ original_url: url, short_url: urls.length });
      }
    }
  })

});

app.get('/api/shorturl/:index', (req, res) => {
  try {
    if (req.params.index <= urls.length) {
      res.redirect(urls[req.params.index - 1]);
    }
  } catch (error) {
    res.json({ "error": "Invalid number" })
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
