var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;

passport.use(new GoogleStrategy({
    returnURL: 'http://127.0.0.1:3000/',
    realm: 'http://127.0.0.1:3000/'
  },
  function(identifier, profile, done) {
  }
));

exports.passport = passport;
exports.authItems = [{
    key: 'google',
    authUrl: '',
    returnUrl: ''
}];