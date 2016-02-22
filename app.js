'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret'

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
	secret: SESSION_SECRET
}));

app.use((req, res, next) => {
    // this middleware counts the number of sessions. check the termina, and refresh to watch counter go up.
    // even if you add a space somewhere, nodemon will restart the server
    req.session.count = req.session.count || 0;
    req.session.count++;
    console.log(req.session);
    next();
});



app.get('/', (req, res) => {
	res.render('index');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', (req, res) => {
	res.redirect('/');
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	if (req.body.password === req.body.verify) {
		res.redirect('/login');
	} else {
		res.render('register', {
			email: req.body.email,
			message: 'passwords do not match'
		})
	}
});






app.listen(PORT, () => {
	console.log(`app server is running on port ${PORT}`)
})

