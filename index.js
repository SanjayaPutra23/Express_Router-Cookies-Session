// define express init
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

// define port
const port = 3000;
const secret = 'secret-key';

// define Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(secret));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

// define routes
app.get('/signingcookie', (req, res) => {
    res.cookie("paket", "ransel", { signed: true });
    res.send('signed cookie');
})

app.get('/verifycookie', (req, res) => {
    const cookies = req.signedCookies
    res.send(cookies)
})

app.get('/counnt', (req, res) => {
    if(req.session.count) {
        req.session.count ++
    } else {
        req.session.count = 1
    }
    res.send(`count: ${req.session.count}`);
})

app.get('/register', (req, res) => {
    const { username = 'Anonim' } = req.query
    req.session.username = username
    res.redirect('/dashboard')
})

app.get('/dashboard', (req, res) => {
    res.send(`Welcome back ${req.session.username}`)
})

app.use('/admin', require('./routes/admin'));
app.use('/theater', require('./routes/theater'));
app.use('/movies', require('./routes/movies'));

// start server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})