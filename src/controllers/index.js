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

router.get('/', indexCtrl);
router.get('/dashboards/:id', indexCtrl);

router.get('/stat', statCtrl);

router.get('/admin', function (req, res) {
    res.render('admin');
});