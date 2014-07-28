'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var Project = require('../logicals/project');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');

router.get(
    '/api/data_sources',
    function(req, res, next){
        DataSource.find().then(function(dataSources){
            res.send(dataSources);
        }).catch(next);
    }
);

router.get(
    '/api/data_sources/:id',
    function(req, res, next){
        var id = parseInt(req.param('id', 10));

        DataSource.get(id).then(function(dataSource){
            if(!dataSource){
                return res.send(404);
            }

            res.send(dataSource);
        }).catch(next);
    }
);

router.get(
    '/api/data_sources/:id/records',
    function(req, res, next){
        var id = parseInt(req.param('id', 10));
        var limit = parseInt(req.param('limit') || 0, 10);
        var orderBy = req.param('orderBy') || undefined;
        var periodValue = req.param('period') || undefined;
        var period;

        if(periodValue){
            periodValue = periodValue.split(',');

            var now = new Date();
            period = {
                begin: new Date(now.getTime() - periodValue[0]*1000*60*60*24),
                end: new Date(now.getTime() - periodValue[1]*1000*60*60*24)
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

router.post(
    '/api/data_sources',
    bodyParser.json(),
    function(req, res, next){
        var dataSource = req.body;

        if(!dataSource.project_id || !dataSource.name || !dataSource.key){
            res.send(400);
        }

        Project.get(dataSource.project_id).then(function (project){
            if(!project){
                return res.send(400);
            }
        });

        DataSource.save(dataSource).then(function (id){
            return DataSource.get(id);
        }).then(function (dataSource){
            res.send(dataSource);
        }).catch(next);
    }
);

router.put(
    '/api/data_sources/:id',
    bodyParser.json(),
    function(req, res, next){
        var dataSource = req.body;

        if(!dataSource.name && !dataSource.key){
            res.send(400);
        }

        var id = parseInt(req.param('id'), 10);

        DataSource.update(id, dataSource).then(function (){
            return DataSource.get(id);
        }).then(function (dataSource){
            res.send(dataSource);
        }).catch(next);
    }
);

router.delete(
    '/api/data_sources/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);

        DataSource.remove(id).then(function (){
            res.send(200);
        }).catch(next);
    }
);