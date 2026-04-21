const express = require('express');
const app = express();

app.use((req, res, next) => {
  const auth = { login: 'principessa', password: 'bubulovesyou' };

  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login === auth.login && password === auth.password) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Protected"');
  res.status(401).send('Login required');
});

app.get('/', (req, res) => {
  res.send('
    <h1>You're Logged In Baby</h1>
    <a href="https://www.mediafire.com/file/88bdbluweoug4tn/Intro_to_the_World_of_Data_Science_and_AI.mp4/file" target="_blank">Intro to the World of Data Science and AI</a>
    <a href="https://www.mediafire.com/file/r0podthzia5fnbf/Introduction_to_Python.mp4/file" target="_blank">Introduction to Python</a>
    <a href="https://www.mediafire.com/file/x42jm7j6agulej6/Data_Science_and_Artificial_Intelligence_Application_Case_Study.mp4/file" target="_blank">Data Science and Artificial Intelligence</a>
    <a href="https://www.mediafire.com/file/86wwfff4hidl07a/Mathematics_and_Statistics_Behind_DS.mp4/file" target="_blank">Mathematics and Statistics Behind DS</a>    
  ');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running'));