'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
// so session counts the number of url visits, and Redis stores the count
const RedisStore = require('connect-redis')(session);
const mongoose = require('mongoose');
const userRoutes = require('./lib/user/routes');
const methodOverride = require('method-override');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret'

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended:false}));

// set this up to get delete method working for logout
app.use(methodOverride('_method'))

// redis will keep the session count going, even after the server has been stopped and restarted
app.use(session({
	secret: SESSION_SECRET,
    store: new RedisStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(userRoutes);
app.locals.title = '';

app.use((req, res, next) => {
    console.log(req);
    res.locals.user;
    next();
});

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



// app.use((req, res, next) => {
//     // this middleware counts the number of sessions. check the terminal, and refresh to watch counter go up.
//     // even if you add a space somewhere, nodemon will restart the server

//     req.session.count = req.session.count || 0;
//     req.session.count++;
//     console.log(req.session);
//     next();
// });



mongoose.connect('mongodb://localhost:27017/nodeAuth', (err) => {
    if(err) throw err;

    app.listen(PORT, () => {
        console.log(`app server is running on port ${PORT}`)
    });
});


