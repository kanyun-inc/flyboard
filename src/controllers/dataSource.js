'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var Promise = require('bluebird');
var Project = require('../logicals/project');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');
var Folder = require('../logicals/folder');

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
    '/api/folders/:id/data_sources',
    function (req, res, next) {
        var id = parseInt(req.param('id', 10));

        Folder.get(id).then(function (folder) {
            if(!folder) {
                return res.send(404);
            }

            DataSource.find({
                folder_id: id
            }).then(function (dataSources) {
                res.send(dataSources);
            }).catch(next);
        });
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

        DataSource.get(id)
            .then(function (dataSource) {
                if(!dataSource) {
                    return res.send(404);
                }

                var promises = Record.find({
                    query: {
                       data_source_id: dataSource.id
                    }
                }).then(function (records) {
                    return records.map(function (record) {
                        return Record.remove(record.id);
                    });
                });

                Promise.all(promises).then(function (){

                    DataSource.remove(dataSource.id).then(function (){
                        res.send(200);
                    }).catch(next);
                });
            });
    }
);