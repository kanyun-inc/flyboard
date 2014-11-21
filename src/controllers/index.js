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

function loginCtrl(req, res) {
    res.locals.authItems = authItems;
    res.render('login');
}

router.get('/', indexCtrl);
router.get('/dashboards/:id', indexCtrl);

router.get('/stat', statCtrl);

router.get('/admin', function (req, res) {
    res.render('admin');
});

router.get('/login', loginCtrl);