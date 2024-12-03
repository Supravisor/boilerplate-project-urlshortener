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
let counter = 0;

// POST for shorturl
app.post('/api/shorturl', (req, res) => {
  let url = req.body.url;
  if (!urls.includes(url)) {
    urls.push(url);
    res.json( {
      original_url: url,
      short_url: counter + 1
    } )
  }
});

app.get('/api/shorturl/:number', (req, res) => {
  console.log(urls);
  if (urls.length > req.params.number) {
    console.log("redirect");
    res.redirect(urls[req.params.number - 1]);
  } else {
    console.log("error");
    res.json({ "error": "Invalid number" })
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
