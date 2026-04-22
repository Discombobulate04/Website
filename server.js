const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'simple-secret',
  resave: false,
  saveUninitialized: false
}));

const USER = {
  username: 'principessa',
  password: 'bubulovesyou'
};

// ✅ Allow CSS/images publicly
app.use('/style.css', express.static(path.join(__dirname, 'public/style.css')));

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

  res.send('Wrong login');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// 🔒 Protect everything else
app.use(requireLogin);

// Now allow all files after login
app.use(express.static('public'));

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Running'));