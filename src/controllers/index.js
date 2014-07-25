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

function statCtrl(req, res, next){
    var widget = {};
    widget.config = {
        name: '',
        dataInfos: [],
        reloadInterval: 600000
    };
    var dataSources = DataSource.find().then(function(dataSources) {
        if (!dataSources || dataSources.length === 0) {
            return [];
        }
        else {
            return dataSources;
        }
    });

    var dataSourceIds = req.param('dataSourceIds') ?
        (function(){
            var ids = req.param('dataSourceIds').split(',');
            return ids || [];
        }()) : [];

    var period = req.param('period') || 300;

    var multiRecords = Promise.map(dataSourceIds, function(id){
        widget.config.dataInfos.push({
            id: parseInt(id, 10)
        });

        return DataSource.get(id).then(function(dataSource) {
            return Record.find({
                data_source_id: id
            }).then(function(records){
                return {
                    name: dataSource.name,
                    dataSourceId: id,
                    data: records
                };
            });
        });
    }).then(function(results){
        // console.log(results);
        return results;
    });
    console.log('xxx');

    res.locals.title = 'Status';
    Promise.props({
        widget: widget,
        dataSources: dataSources,
        period: period,
        multiRecords: multiRecords
    }).then(function (result) {
        console.log(result.multiRecords);
        res.render('stat', result);
    }).catch(next);
}

router.get('/', indexCtrl);
router.get('/dashboards/:id', indexCtrl);

router.get('/stat', statCtrl);

router.get('/admin', function (req, res) {
    res.render('admin');
});