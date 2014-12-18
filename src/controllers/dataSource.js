'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var Project = require('../logicals/project');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');
var apiAuthFilter = require('./apiAuthFilter');

router.get(
    '/api/data_sources',
    function(req, res, next){
        var folderId = parseInt(req.param('folder_id'), 10);
        var projectId = parseInt(req.param('project_id'), 10);
        var userId = req.user ? req.user.id : null;
        var query = {};

        folderId = (!folderId && folderId !== 0) ? -1 : folderId;
        if(folderId !== -1){
            query.folder_id = folderId === 0 ? null : folderId;
        }

        if(projectId){
            query.project_id = projectId;
        }

        apiAuthFilter.vertifyProjectAuthority(userId, projectId)
            .then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return DataSource.find(query);
            }).then(function(dataSources){
                return res.send(dataSources);
            }).catch(next);
    }
);

router.get(
    '/api/data_sources/:id',
    function(req, res, next){
        var id = parseInt(req.param('id', 10));
        var userId = req.user ? req.user.id : null;

        DataSource.get(id)
            .then(function(dataSource) {
                if (!dataSource) {
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return DataSource.get(id);
            }).then(function (dataSource){
                return res.send(dataSource);
            }).catch(next);
    }
);

router.post(
    '/api/data_sources',
    bodyParser.json(),
    function(req, res, next){
        var dataSource = req.body;
        var config = dataSource.config;
        var userId = req.user ? req.user.id : null;

        if(!dataSource.project_id || !dataSource.name || !dataSource.key){
            return res.send(400);
        }

        if(config && config.dimensions){
            if(config.dimensions.length > 3){
                return res.send(400);
            }
        }

        apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id)
            .then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Project.get(dataSource.project_id);
            }).then(function (project) {
                if (!project) {
                    return res.send(400);
                }

                return DataSource.save(dataSource);
            }).then(function (id){
                return DataSource.get(id);
            }).then(function (dataSource) {
                return res.send(dataSource);
            }).catch(next);
    }
);

router.put(
    '/api/data_sources/:id',
    bodyParser.json(),
    function(req, res, next){
        var dataSource = req.body;
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;

        if(!dataSource.name && !dataSource.key){
            return res.send(400);
        }

        apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id)
            .then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Project.get(dataSource.project_id);
            }).then(function (project) {
                if (!project) {
                    return res.send(400);
                }

                return DataSource.update(id, dataSource);
            }).then(function (){
                return DataSource.get(id);
            }).then(function (dataSource) {
                return res.send(dataSource);
            }).catch(next);
    }
);

router.delete(
    '/api/data_sources/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;

        DataSource.get(id)
            .then(function (dataSource) {
                if (!dataSource) {
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Record.removeList(id);
            }).then(function () {
                return DataSource.remove(id);
            }).then(function () {
                return res.send(200);
            }).catch(next);
    }
);