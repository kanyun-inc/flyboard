'use strict';

var router = require('express').Router();
var authItems = require('../../configs/app').authItems;

module.exports = router;

var passport = require('../../configs/app').passport;

//auth
router.get('/auth/google', passport.authenticate('google'));

router.get('/auth/google/return',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

function loginCtrl(req, res) {
    res.locals.authItems = authItems;
    res.render('login');
}

router.get('/login', loginCtrl);