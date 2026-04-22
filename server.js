const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false // IMPORTANT: stops auto-login
}));

// Hardcoded user
const USER = {
  username: 'principessa',
  password: 'bubulovesyou'
};

// 🔒 Middleware to protect routes
function requireLogin(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

// ✅ LOGIN PAGE (public)
app.get('/login', (req, res) => {
  // If already logged in, go to home
  if (req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// ✅ HANDLE LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    return res.redirect('/');
  }

  res.send('Wrong login');
});

// ✅ LOGOUT
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// 🔒 EVERYTHING BELOW REQUIRES LOGIN
app.use(requireLogin);

// Serve static files ONLY after login
app.use(express.static('public'));

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port ' + PORT));