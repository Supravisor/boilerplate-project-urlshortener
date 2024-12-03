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

// Array for urls
let urls = [];

// POST for shorturl
app.post('/api/shorturl', (req, res) => {
  let url = req.body.url;
  dns.lookup(url.replace(/^https:\/\/(www.)?/, ''), (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' })
    }
    else {
      if (!urls.includes(url)) {
        urls.push(url);
      } else {
        res.json({ original_url: url, short_url: urls.length });
      }
    }
  })
});

app.get('/api/shorturl/:number', (req, res) => {
  try {
    if (req.params.number <= urls.length) {
      res.redirect(urls[req.params.number - 1]);
    }
  } catch (error) {
    res.json({ "error": "Invalid number" })
  }

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
