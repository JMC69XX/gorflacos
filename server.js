const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'secretoSuperSegura',
  resave: false,
  saveUninitialized: true
}));

// Leer usuarios desde un JSON simulado
const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf8'));

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = usuarios.find(u => u.email === email && u.password === password);
  
  if (user) {
    req.session.usuario = user.email;
    res.redirect('/dashboard.html'); // página privada
  } else {
    res.send('Credenciales inválidas. <a href="/login.html">Volver</a>');
  }
});

app.get('/dashboard.html', (req, res) => {
  if (req.session.usuario) {
    res.sendFile(__dirname + '/public/dashboard.html');
  } else {
    res.redirect('/index.html');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
