'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');
var apiAuthFilter = require('./apiAuthFilter');

router.post(
    '/api/projects/:uuid/data_sources/:key',
    bodyParser.json(),
    function(req, res, next){
        var record = req.body;
        var uuid = req.param('uuid');
        var key = req.param('key');
        var userId = req.user ? req.user.id : null;
        var dataSourceId = null;
        var projectId = null;

        if(record.value === undefined){
            return res.send(400);
        }

        DataSource.getByUUIDAndKey(uuid, key)
            .then(function (dataSource) {
                if (!dataSource) {
                    return res.send(404);
                }

                dataSourceId = dataSource.id;
                projectId = dataSource.project_id;

                return apiAuthFilter.vertifyProjectAuthority(userId, projectId);
            }).then(function (authResult){
                if(!authResult){
                    return res.send(403);
                }

                return DataSource.get(dataSourceId);
            }).then(function (dataSource) {
                //check if dimensions are the same
                if (dataSource.config && dataSource.config.dimensions) {
                    dataSource.config.dimensions.forEach(function (dim) {
                        if (!record[dim.key]) {
                            return res.send(400);
                        }
                    });
                }

                record.data_source_id = dataSource.id;
                return Record.save(record);
            }).then(function (id) {
                return Record.get(id);
            }).then(function (record) {
                return res.send(record);
            }).catch(next);
    }
);

router.get(
    '/api/records/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;

        Record.get(id)
            .then(function (record){
                if(!record){
                    return res.send(404);
                }

                return DataSource.get(record.data_source_id);
            }).then(function (dataSource){
                if(!dataSource){
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Record.get(id);
            }).then(function (record){
                return res.send(record);
            }).catch(next);
    }
);

router.get(
    '/api/data_sources/:id/records',
    function(req, res, next){
        var dataSourceId = parseInt(req.param('id'), 10);
        var limit = parseInt(req.param('limit') || 0, 10);
        var count = parseInt(req.param('count') || 0, 10);
        var orderBy = req.param('orderBy') || undefined;
        var distinct = req.param('distinct') || null;
        var periodValue = (req.param('period') || '').split(',');
        var period = null;
        var dimensions = JSON.parse(req.param('dimensions') || '[]');
        var userId = req.user ? req.user.id : null;

        if(periodValue && periodValue.length === 2){
            var now = new Date();
            period = {
                begin: new Date(now.getTime() - periodValue[1]*1000*60*60*24),
                end: new Date(now.getTime() - periodValue[0]*1000*60*60*24)
            };
        }

        DataSource.get(dataSourceId)
            .then(function(dataSource) {
                if (!dataSource) {
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(404);
                }

                return DataSource.get(dataSourceId);
            }).then(function (dataSource) {
                var query = {
                    data_source_id: dataSourceId
                };

                dimensions.forEach(function (dim) {
                    if (!dim.value || dim.value === 'sum' || dim.value === 'ignore') {
                        return;
                    }

                    dataSource.config.dimensions.some(function (dimension, idx) {
                        if (dimension.key === dim.key) {
                            query['dim' + (idx + 1)] = dim.value;
                            return true;
                        }
                    });
                });

                return Record.find({
                    query: query,
                    count: count,
                    limit: limit,
                    orderBy: orderBy,
                    period: period,
                    distinct: distinct
                });
            }).then(function(records){
                return res.send(records);
            }).catch(next);
    }
);

router.delete(
    '/api/records/:id',
    function(req, res, next) {
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;

        Record.get(id)
            .then(function (record){
                if(!record){
                    return res.send(404);
                }

                return DataSource.get(record.data_source_id);
            }).then(function (dataSource){
                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Record.remove(id);
            }).then(function () {
                return res.send(200);
            }).catch(next);
    }
);

router.delete('/api/data_sources/:id/records',
    function(req, res, next) {
        var dataSourceId = req.param('id') ? parseInt(req.param('id'), 10) : null;
        var userId = req.user ? req.user.id : null;

        var year = req.param('year') ? parseInt(req.param('year'), 10) : null;
        var month = req.param('month') ? parseInt(req.param('month'), 10) : null;
        var day = req.param('day') ? parseInt(req.param('day'), 10) : null;
        var hour = req.param('hour') ? parseInt(req.param('hour'), 10) : null;
        var minute = req.param('minute') ? parseInt(req.param('minute'), 10) : null;
        var second = req.param('second') ? parseInt(req.param('second'), 10) : null;

        if(!dataSourceId) {
            return res.send(400);
        }

        var query = {};
        if(year){
            query.year = year;
        }
        if(month){
            query.month = month;
        }
        if(day){
            query.day = day;
        }
        if(hour){
            query.hour = hour;
        }
        if(minute){
            query.minute = minute;
        }
        if(second){
            query.second = second;
        }

        DataSource.get(dataSourceId)
            .then(function (dataSource) {
                if (!dataSource) {
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return DataSource.get(dataSourceId);
            }).then(function (dataSource) {
                return Record.removeList(dataSource.id, query);
            }).then(function (){
                return res.send(200);
            }).catch(next);
    }
);