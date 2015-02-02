'use strict';

var router = require('express').Router();
var passport = require('../../configs/app').passport;
var authItems = require('../../configs/app').authItems;
var _ = require('underscore');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

module.exports = router;

// local router
router.get('/auth/local', function (req, res){
    var defaultUser = {email: 'bob@example.com', password: 'secret'};

    return res.redirect('/auth/local/return' + '?email=' + defaultUser.email + '&password=' + defaultUser.password);
});
router.post('/auth/local/return', function (req, res){
    return res.send(200);
});

authItems.forEach(function (item) {
    //auth
    if(item.authUrl){
        router.all(item.authUrl, urlencodedParser, passport.authenticate(item.key, _.defaults({
            failureFlash: true,
            successRedirect: '/',
            failureRedirect: '/login'
        }, item.authenticate)));
    }

    if (item.returnUrl) {
        router.all(item.returnUrl,
            passport.authenticate(item.key, _.defaults({
                failureFlash: true,
                successRedirect: '/',
                failureRedirect: '/login'
            }, item.authenticate)));
    }
});

function loginCtrl(req, res) {
    res.locals.authItems = authItems;
    res.render('login');
}

function logoutCtrl(req, res) {
    req.session.destroy();

    var redirect = req.param('redirect', '/');
    res.redirect(redirect);
}

router.get('/login', loginCtrl);
router.get('/logout', logoutCtrl);