const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: 'simple-secret',
  resave: false,
  saveUninitialized: false
}));

// Simple login (no hashing)
const USER = {
  username: 'principessa',
  password: 'bubulovesyou'
};

// 🔒 Auth middleware
function requireLogin(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

// Login page
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    return res.redirect('/');
  }

  res.send('<h2 style="color:white;text-align:center;margin-top:50px;">Wrong login</h2>');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// 🔒 Protect everything below
app.use(requireLogin);

// Serve files AFTER login
app.use(express.static('public'));

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port ' + PORT));