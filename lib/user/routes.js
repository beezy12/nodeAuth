'use strict';

const express = require('express');
const router = express.Router();

const User = require('./model');




router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) throw err;

        if (user) {
            user.authenticate(req.body.password, (err, valid) => {
                if (err) throw err;

                if (valid) {
                    // this sets the logged in user to the req.session.user so we can output that info to jade
                    req.session.user = user;
                    res.redirect('/');
                } else {
                    res.redirect('/login');
                }
            })
    } else {
        res.redirect('/login');
    }
    });
});

router.get('/register', (req, res) => {
    res.render('register');
});

// check if already registered, if not create user obj in the database. start interfacing with mongo
router.post('/register', (req, res) => {
    if (req.body.password === req.body.verify) {
        // findOne is checking if it already exists
        // user would be null or something in it
        User.findOne({email: req.body.email}, (err, user) => {
        if (err) throw err;

        if (user) {
            res.redirect('/login');
        } else {
            User.create(req.body, (err) => {
                if(err) throw err;
                res.redirect('/login');
            });
        }
        });
    } else {
        res.render('register', {
        email: req.body.email,
        message: 'Passwords do not match'
        });
    }
});


router.delete('/login', (req, res) => {
    req.session.regenerate(function(err) {
        if (err) throw err;

        res.redirect('/');
  });
});




module.exports = router;




