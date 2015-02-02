'use strict';

// Passport Configuration
//
// authItems support multiple strategies.
//
// ```javascript
// exports.authItems = [
//     {
//         key: 'local',
//         keyName: 'Local',
//         authUrl: '/auth/local',
//         returnUrl: '/auth/local/return'
//     },
//     {
//         key: 'google',
//         keyName: 'Google',
//         ...
//     }
// ];
// ```

var passport = require('passport');
var User = require('../src/logicals/user');

/*
 * local passport example
 */
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, done) {
    // find user, if user doesn't exist, create
    User.findOrCreate({
        email: email
    }).then(function (user){
        done(null, user);
    }).catch(done);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(email, done) {
    User.findOne({
        email: email
    }).then(function (user){
        if(!user){
            var err = new Error('invalid user');
            err.status = 403;

            return done(err, user);
        }

        return done(null, user);
    }).catch(done);
});

exports.passport = passport;
exports.authItems = [
    {
        key: 'local',
        keyName: 'Local',
        authUrl: '/auth/local',
        returnUrl: '/auth/local/return'
    }
];

/*
* google passport example
*/
//var GoogleStrategy = require('passport-google').Strategy;
//
//passport.use(new GoogleStrategy({
//    returnURL: 'http://127.0.0.1:3000/auth/google/return',
//    realm: 'http://127.0.0.1:3000/'
//}, function (identifier, profile, done) {
//    var email = null;
//
//    if (profile && profile.emails && profile.emails.length) {
//        email = profile.emails[0].value;
//    }
//
//    //err handle
//    if (!email) {
//        done(new Error('invalid email'));
//    }
//
//    User.findOrCreate({
//        email: email
//    }).then(function (user) {
//        done(null, user);
//    }).catch(done);
//}));
//
//passport.serializeUser(function (user, done) {
//    done(null, user.email);
//});
//
//passport.deserializeUser(function (email, done) {
//    User.findOne({
//        email: email
//    }).then(function (user) {
//        if (!user) {
//            var err = new Error('invalid session');
//            err.status = 403;
//            done(err, user);
//            return;
//        }
//
//        done(null, user);
//    }).catch(done);
//});
//
//exports.passport = passport;
//exports.authItems = [{
//    key: 'google',
//    keyName: 'Google',
//    authUrl: '/auth/google',
//    returnUrl: '/auth/google/return'
//}];
