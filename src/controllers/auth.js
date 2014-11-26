'use strict';

var router = require('express').Router();
var passport = require('../../configs/app').passport;
var authItems = require('../../configs/app').authItems;

module.exports = router;

authItems.forEach(function (item) {
    //auth
    router.get(item.authUrl, passport.authenticate(item.key));

    router.get(item.returnUrl,
        passport.authenticate(item.key, {
            successRedirect: '/',
            failureRedirect: '/login'
        }));
});

function loginCtrl(req, res) {
    res.locals.authItems = authItems;
    res.render('login');
}

router.get('/login', loginCtrl);