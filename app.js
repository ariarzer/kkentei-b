const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

const db = require('./services/db');

app.get('/', (req, res) => {
  db.all('SELECT * FROM kanji;', (err, data) => {
    res.send(data)
  });
})

app.listen(port);
