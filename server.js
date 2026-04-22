const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));

// Hardcoded user (you can upgrade later)
const USER = {
  username: 'principessa',
  password: 'bubulovesyou'
};

// Auth middleware
function requireLogin(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    return res.redirect('/');
  }

  res.send('Wrong login');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running'));