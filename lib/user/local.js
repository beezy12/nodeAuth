'use strict'

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./model');

const SUCCESSFUL_LOGIN_MSG = 'Success!';
const INCORRECT_USERNAME_MSG = 'incorrect username or password';
const INCORRECT_PASSWORD_MSG = 'Incorrect Username or password';


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});


passport.use(new LocalStrategy ({
    usernameField: 'email'
    },
    (email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
            if (err) throw err;

            if (user) {
        user.authenticate(password, (err, valid) => {
          if (err) throw err;

          if (valid) {
            done(null, user, { message: SUCCESSFUL_LOGIN_MSG });
          } else {
            done(null, null, { message: INCORRECT_PASSWORD_MSG });
          }
        });
      } else {
        done(null, null, { message: INCORRECT_USERNAME_MSG });
      }
    });
  })
);
