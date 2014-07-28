'use strict';

var router = require('express').Router();
module.exports = router;

var Widget = require('../logicals/widget');
var Dashboard = require('../logicals/dashboard');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');
var Promise = require('bluebird');

function recordsSort (multiRecords){
    var sortedMultiRecords = [];
    var stopFlag = false;
    var pointers = [];

    multiRecords.forEach(function(records, idx){
        pointers[idx] = 0;
        sortedMultiRecords[idx] = [];
    });

    while(!stopFlag){
        var max = null;
        var newRecords = [];

        multiRecords.forEach(function(records, idx){
            var pointer = pointers[idx];

            if(pointer >= records.length){
                return ;
            }

            var time = Date.parse(new Date(records[pointer].year || 0,
                records[pointer].month || 0, records[pointer].day || 0, records[pointer].hour || 0, records[pointer].minute || 0, records[pointer].second || 0));
            if(max === null || max < time){
                max = time;
                newRecords = [idx];
            }
            else if(max === time){
                newRecords.push(idx);
            }
        });

        if(max === null){
            stopFlag = true;
            continue;
        }

        multiRecords.forEach(function(records, idx){
            if(newRecords.indexOf(idx) === -1){
                sortedMultiRecords[idx].push({
                    time: new Date(max),
                    value: '--'
                });
            }
            else{
                sortedMultiRecords[idx].push({
                    time: new Date(max),
                    value: records[pointers[idx]].value
                });

                pointers[idx] = pointers[idx] + 1;
            }
        });

    }

    return sortedMultiRecords;
}

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

    var dataSourceIds = req.param('dataSourceIds') ?
        (function(){
            var ids = req.param('dataSourceIds').split(',');
            return ids || [];
        }()) : [];

    widget.config.period = req.param('period') || '0,7';    //默认显示7天数据

    var multiRecords = Promise.map(dataSourceIds, function(id){
        widget.config.dataInfos.push({
            id: parseInt(id, 10)
        });

        return DataSource.get(id).then(function(dataSource) {
            return Record.find({
                query: {
                    data_source_id: id
                }
            }).then(function(records){
                return {
                    name: dataSource.name,
                    dataSourceId: id,
                    data: records
                };
            });
        });
    }).then(function(results){
        var unSortedMultiRecords = [];
        results.forEach(function(result, idx){
            unSortedMultiRecords[idx] = result.data;
        });
        var sortedMultiRecords = recordsSort(unSortedMultiRecords);
        results.forEach(function(result, idx){
            result.data = sortedMultiRecords[idx];
        });
        return results;
    });

    res.locals.title = 'Status';
    Promise.props({
        widget: widget,
        multiRecords: multiRecords
    }).then(function (result) {
        res.render('stat', result);
    }).catch(next);
}

router.get('/', indexCtrl);
router.get('/dashboards/:id', indexCtrl);

router.get('/stat', statCtrl);

router.get('/admin', function (req, res) {
    res.render('admin');
});