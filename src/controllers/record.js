'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var blueBird = require('bluebird');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');

router.post(
    '/api/projects/:uuid/data_sources/:key',
    bodyParser.json(),
    function(req, res, next){
        var record = req.body;

        if(record.value === undefined){
            return res.send(400);
        }

        DataSource.getByUUIDAndKey(req.param('uuid'), req.param('key')).then(function (dataSource) {
            //check if dimensions are the same
            if(dataSource.config && dataSource.config.dimensions){
                dataSource.config.dimensions.forEach(function (dim) {
                   if(!record[dim.key]){
                       return res.send(400);
                   }
                });
            }

            record.data_source_id = dataSource.id;
            return Record.save(record).then(function (id) {
                return Record.get(id);
            }).then(function (record) {
                res.send(record);
            });
        }).catch(next);
    }
);

router.get(
    '/api/records/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);

        Record.get(id).then(function (record){
            if(!record){
                return res.send(404);
            }

            res.send(record);
        }).catch(next);
    }
);

router.get(
    '/api/data_sources/:id/records',
    function(req, res, next){
        var id = parseInt(req.param('id', 10));
        var limit = parseInt(req.param('limit') || 0, 10);
        var count = parseInt(req.param('count') || 0, 10);
        var orderBy = req.param('orderBy') || undefined;
        var distinct = req.param('distinct') || null;
        var periodValue = (req.param('period') || '').split(',');
        var period = null;
        var dimensions = JSON.parse(req.param('dimensions') || '[]');

        if(periodValue && periodValue.length === 2){
            var now = new Date();
            period = {
                begin: new Date(now.getTime() - periodValue[1]*1000*60*60*24),
                end: new Date(now.getTime() - periodValue[0]*1000*60*60*24)
            };
        }

        DataSource.get(id).then(function(dataSource){
            if(!dataSource){
                return res.send(404);
            }

            var query = {
                data_source_id: id
            };

            dimensions.forEach(function (dim) {
                if(!dim.value || dim.value === 'sum' || dim.value === 'ignore'){
                    return ;
                }

                dataSource.config.dimensions.some(function (dimension, idx) {
                    if(dimension.key === dim.key){
                        query['dim' + (idx + 1)] = dim.value;
                        return true;
                    }
                });
            });

            Record.find({
                query: query,
                count: count,
                limit: limit,
                orderBy: orderBy,
                period: period,
                distinct: distinct
            }).then(function(records){
                res.send(records);
            });
        }).catch(next);
    }
);

router.delete(
    '/api/records/:id',
    function(req, res, next) {
        var id = parseInt(req.param('id'), 10);
        Record.remove(id).then(function () {
            res.send(200);
        }).catch(next);
    }
);

router.delete('/api/data_sources/:id/records',
    function(req, res, next) {
        var id = req.param('id') ? parseInt(req.param('id'), 10) : null;

        if(!id) {
            return res.send(400);
        }

        DataSource.get(id).then(function (dataSource) {
            if(!dataSource) {
                return res.send(404);
            }

            Record.removeList(dataSource.id).then(function (){
                res.send(200);
            }).catch(next);
        });
    }
);