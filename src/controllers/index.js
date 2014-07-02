'use strict';

var router = require('express').Router();
module.exports = router;

var Widget = require('../logicals/widget');
var Dashboard = require('../logicals/Dashboard');
var Promise = require('bluebird');

function indexCtrl(req, res, next) {
    var dashboards = Dashboard.find();
    var dashboard = req.param('dashboardId') ?
        Dashboard.get(parseInt(req.param('dashboardId'), 10)) :
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

router.get('/', indexCtrl);
router.get('/dashboards/:id', indexCtrl);
