const express = require('express')
const cors = require('cors');
const checkApiToken = require('./services/checkApiToken');
const jwt = require('jsonwebtoken');
const hashPassword = require('./services/hashPassword');
const checkPassword = require('./services/checkPassword');
const db = require('./services/db');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://kkentei-f.vercel.app',
];

app.use( cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`cors not allowed for ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(checkApiToken);

app.post('/createUser', async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  const existed = await db.all(`SELECT * FROM users WHERE email = '${email}' OR username = '${username}'`);

  if (existed.length > 0) {
    res.status(500);
    res.send('User already exists');
  }

  const hash = await hashPassword(password);

  db.all(`INSERT INTO users (username, email, hash) VALUES ('${username}', '${email}', '${hash}');`);

  res.send();
})

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const hashedPassword = await db.all(`SELECT hash FROM users WHERE username = '${username}'`);

  const isValid = checkPassword(password, hashedPassword);

  if (!isValid) {
    res.status(401);
    res.send();
  }

  const token = jwt.sign({username, password}, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 1000 * 60 * 60 * 24 * 7
  });

  res.send();
})

app.get('/getAllKanji', (req, res) => {
  db.all('SELECT * FROM kanji;').then((data) => {
    res.send(data)
  })
})

app.listen(port);
