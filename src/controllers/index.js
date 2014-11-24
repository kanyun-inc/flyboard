'use strict';

var router = require('express').Router();
var authItems = require('../../configs/app').authItems;

module.exports = router;

function indexCtrl(req, res) {
    res.locals.title = 'Flyboard';
    res.render('index');
}

function statCtrl(req, res){
    res.locals.title = 'status';
    res.render('stat');
}

function adminCtrl(req, res) {
    res.render('admin');
}

function loginCtrl(req, res) {
    res.locals.authItems = authItems;
    res.render('login');
}

function mustLogin(req, res, next) {
    if (!req.user) {
        return res.redirect('/login?redirect=' + encodeURIComponent(req.url));
    }

    next();
}

router.get('/', mustLogin, indexCtrl);

router.get('/dashboards/:id', mustLogin, indexCtrl);

router.get('/stat', mustLogin, statCtrl);

router.get('/admin', mustLogin, adminCtrl);

router.get('/login', loginCtrl);