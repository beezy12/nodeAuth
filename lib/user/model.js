'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_DIFFICULTY = 11;

const UserSchema = new mongoose.Schema({
      email: String,
      password: String
});

// compare the user's password to the stored encrypted password in the db
// this.password comes from the user's password object that was on req.body.password
UserSchema.methods.authenticate = function (password, cb) {
    bcrypt.compare(password, this.password, cb);
};

// .pre save is a mongoose method. is an event listerne, listenging for a save event inside of mongoose. turns
// a regular password into a hashed password
UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, BCRYPT_DIFFICULTY, (err, hash) => {

        if (err) throw err;

        this.password = hash;
        next();
    });
});





module.exports = mongoose.model('Users', UserSchema);

