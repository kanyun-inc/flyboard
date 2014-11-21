'use strict';

var router = require('express').Router();
module.exports = router;

var passport = require('../../configs/app').passport;

//auth
router.get('/auth/google', passport.authenticate('google'));

router.get('/auth/google/return',
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' })
);