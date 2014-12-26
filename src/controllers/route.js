'use strict';

var router = require('express').Router();

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
    res.locals.title = 'admin';
    res.render('admin');
}

function profileCtrl(req, res){
    res.locals.title = 'profile';
    res.render('profile');
}

router.get('/', indexCtrl);

router.get('/dashboards/:id', indexCtrl);

router.get('/stat', statCtrl);

router.get('/admin', adminCtrl);

router.get('/profile', profileCtrl);
