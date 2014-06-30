'use strict';

var router = require('express').Router();
module.exports = router;

var Widget = require('../logicals/widget');

router.get('/', function (req, res, next) {
    var dashboardId = 1;

    Widget.find({dashboard_id: dashboardId}).then(function (widgets){
        res.render('index', {
            title: 'Flyboard',
            widgets: widgets
        });
    }).catch(next);
});
