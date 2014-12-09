'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var User = require('../src/logicals/user');
var blueBird = require('bluebird');

passport.use(new GoogleStrategy({
    returnURL: 'http://127.0.0.1:3000/auth/google/return',
    realm: 'http://127.0.0.1:3000/'
}, function (identifier, profile, done) {
    var email = null;

    if (profile && profile.emails && profile.emails.length) {
        email = profile.emails[0].value;
    }

    //err handle
    if (!email) {
        done(new Error('invalid email'));
    }

    User.findOrCreate({
        email: email
    }).then(function (user) {
        done(null, user);
    }).catch(done);
}));

passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    blueBird.resolve(User.findOne({
        email: email
    })).then(function (user) {
        if (!user) {
            var err = new Error('invalid session');
            err.status = 403;
            done(err, user);
            return;
        }

        done(null, user);
    }).catch(done);
});

exports.passport = passport;
exports.authItems = [{
    key: 'google',
    authUrl: '/auth/google',
    returnUrl: '/auth/google/return'
}];
