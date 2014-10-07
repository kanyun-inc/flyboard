'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var blueBird = require('bluebird');
var Project = require('../logicals/project');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');

router.get(
    '/api/data_sources',
    function(req, res, next){
        var query = {};

        var folderId = parseInt(req.param('folder_id'), 10);
        var projectId = parseInt(req.param('project_id'), 10);

        folderId = (!folderId && folderId !== 0) ? -1 : folderId;
        if(folderId !== -1){
            query.folder_id = folderId === 0 ? null : folderId;
        }

        if(projectId){
            query.project_id = projectId;
        }

        DataSource.find(query).then(function(dataSources){
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

router.post(
    '/api/data_sources',
    bodyParser.json(),
    function(req, res, next){
        var dataSource = req.body;
        var config = dataSource.config;

        if(!dataSource.project_id || !dataSource.name || !dataSource.key){
            return res.send(400);
        }

        if(config && config.dimensions){
            if(config.dimensions.length > 3){
                return res.send(400);
            }
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
        var id = parseInt(req.param('id'), 10);

        if(!dataSource.name && !dataSource.key){
            return res.send(400);
        }

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

                Record.removeList(dataSource.id).then(function () {
                    DataSource.remove(dataSource.id).then(function () {
                        res.send(200);
                    });
                });
        }).catch(next);
    }
);