'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');

router.post(
    '/api/projects/:uuid/data_sources/:key',
    bodyParser.json(),
    function(req, res, next){
        var record = req.body;
        if(record.value === undefined){
            res.send(400);
        }

        DataSource.getByUUIDAndKey(req.param('uuid'), req.param('key')).then(function (dataSource) {
            if (!dataSource) {
                return res.send(404);
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
        var orderBy = req.param('orderBy') || undefined;
        var periodValue = (req.param('period') || '').split(',');
        var period = null;

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
            Record.find({
            query: {
                    data_source_id: id
                    },
            limit: limit,
            orderBy: orderBy,
            period: period
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