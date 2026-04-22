const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));

// 🔐 Replace with YOUR generated hash
const USER = {
  username: 'principessa',
  password: '$2b$10$zPk2igSjmdB4HTug5P0zKe4h8QOwgoExbnccwXkGiPF66ZfFPAzWu'
};

// Auth middleware
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
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username) {
    const match = await bcrypt.compare(password, USER.password);

    if (match) {
      req.session.user = username;
      return res.redirect('/');
    }
  }

  res.send('Wrong login');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// 🔒 Protect everything below
app.use(requireLogin);

// Serve static files AFTER login
app.use(express.static('public'));

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port ' + PORT));