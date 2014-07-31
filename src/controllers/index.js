'use strict';

var router = require('express').Router();
module.exports = router;

var Widget = require('../logicals/widget');
var Dashboard = require('../logicals/dashboard');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');
var Promise = require('bluebird');


function indexCtrl(req, res, next) {
    var dashboards = Dashboard.find();
    var dashboard = req.param('id') ?
        Dashboard.get(parseInt(req.param('id'), 10)) :
        dashboards.then(function (dashboards) {
        if (!dashboards || dashboards.length === 0) {
            return null;
        }

        return dashboards[0];
    });

    var widgets = dashboard.then(function (dashboard) {
        if (!dashboard) {
            return [];
        }

        return Widget.find({
            dashboard_id: dashboard.id
        });
    }).then(function (widgets) {
        return widgets.reduce(function (memo, curr) {
            memo[curr.id] = curr;
            return memo;
        }, {});
    });

    res.locals.title = 'Flyboard';

    Promise.props({
        dashboards: dashboards,
        dashboard: dashboard,
        widgets: widgets
    }).then(function (result) {
        res.render('index', result);
    }).catch(next);
}

function statCtrl(res){
    res.locals.title = 'Status';
    res.render('stat');
}

router.get('/', indexCtrl);
router.get('/dashboards/:id', indexCtrl);

router.get('/stat', statCtrl);

router.get('/admin', function (req, res) {
    res.render('admin');
});