'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret'

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended:false}));

// redis will keep the session count going, even after the server has been stopped and restarted
app.use(session({
	secret: SESSION_SECRET,
    store: new RedisStore()
}));

// app.use((req, res, next) => {
//     // this middleware counts the number of sessions. check the terminal, and refresh to watch counter go up.
//     // even if you add a space somewhere, nodemon will restart the server

//     req.session.count = req.session.count || 0;
//     req.session.count++;
//     console.log(req.session);
//     next();
// });

// req.url counts how many times you've gone to that same url
// browse around the site, and check terminal for counts of each url path
app.use((req, res, next) => {
      req.session.visits = req.session.visits || {};
      req.session.visits[req.url] = req.session.visits[req.url] || 0;
      req.session.visits[req.url]++

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

