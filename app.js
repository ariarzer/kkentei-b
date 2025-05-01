const express = require('express')
const cors = require('cors');
const checkApiToken = require('./services/checkApiToken');
const db = require('./services/db');

const port = process.env.PORT || 3000;

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://kkentei-f.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('cors not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(checkApiToken);

app.get('/', (req, res) => {
  db.all('SELECT * FROM kanji;').then((data) => {
    res.send(data)
  })
})

app.listen(port);
