'use strict';

var router = require('express').Router();
var passport = require('../../configs/app').passport;
var authItems = require('../../configs/app').authItems;
var _ = require('underscore');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded();

module.exports = router;

authItems.forEach(function (item) {
    //auth
    router.all(item.authUrl, urlencodedParser, passport.authenticate(item.key, _.defaults({
        failureFlash: true,
        successRedirect: '/',
        failureRedirect: '/login'
    }, item.authenticate)));

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

router.get('/login', loginCtrl);
router.get('/logout', function (req, res) {
    req.session.destroy();

    var redirect = req.param('redirect', '/');
    res.redirect(redirect);
});
