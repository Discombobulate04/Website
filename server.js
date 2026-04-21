const express = require('express');
const app = express();

// Basic Auth middleware
app.use((req, res, next) => {
  const auth = { login: 'admin', password: '1234' };

  const b64auth = (req.headers.authorization  '').split(' ')[1]  '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login === auth.login && password === auth.password) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="My Site"');
  res.status(401).send('Authentication required.');
});

app.get('/', (req, res) => {
  res.send('<h1>You are logged in</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));