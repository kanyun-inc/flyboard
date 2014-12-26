'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var Project = require('../logicals/project');
var apiAuthFilter = require('./apiAuthFilter');

router.get('/api/projects', function (req, res, next) {
    var userId = req.user ? req.user.id : null;

    apiAuthFilter.vertifyOperationAuthority(userId, 'PROJECT', 'GET')
        .then(function (authResult) {
            if (!authResult) {
                return res.send(403);
            }

            return Project.find({
                user_id: userId
            });
        }).then(function (projects) {
            return res.send(projects);
        }).catch(next);
});

router.get('/api/projects/:id', function (req, res, next) {
    var id = parseInt(req.param('id'), 10);
    var userId = req.user ? req.user.id : null;

    apiAuthFilter.vertifyProjectAuthority(userId, id)
        .then(function (authResult){
            if(!authResult){
                return res.send(403);
            }

            return apiAuthFilter.vertifyOperationAuthority(userId, 'PROJECT', 'GET');
        }).then(function (authResult) {
            if (!authResult) {
                return res.send(403);
            }

            return Project.get(id);
        }).then(function (project) {
            if (!project) {
                return res.send(404);
            }

            return res.send(project);
        }).catch(next);
});

router.post(
    '/api/projects',
    bodyParser.json(),
    function (req, res, next) {
        var userId = req.user ? req.user.id : null;
        var project = req.body;

        if (!project.name) {
            return res.send(400);
        }

        apiAuthFilter.vertifyOperationAuthority(userId, 'PROJECT', 'POST')
            .then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Project.save(project);
            }).then(function (id) {
                return Project.get(id);
            }).then(function (project) {
                return res.send(project);
            }).catch(next);
    }
);

router.put(
    '/api/projects/:id',
    bodyParser.json(),
    function (req, res, next) {
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;
        var project = req.body;

        if (!project.name) {
            return res.send(400);
        }

        apiAuthFilter.vertifyProjectAuthority(userId, id)
            .then(function (authResult){
                if(!authResult){
                    return res.send(403);
                }

                return apiAuthFilter.vertifyOperationAuthority(userId, 'PROJECT', 'PUT');
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Project.update(id, project);
            }).then(function () {
                return Project.get(id);
            }).then(function (project) {
                return res.send(project);
            }).catch(next);
    }
);

router.delete(
    '/api/projects/:id',
    function (req, res, next) {
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;

        apiAuthFilter.vertifyProjectAuthority(userId, id)
            .then(function (authResult){
                if(!authResult){
                    return res.send(403);
                }

                return apiAuthFilter.vertifyOperationAuthority(userId, 'PROJECT', 'DELETE');
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Project.remove(id);
            }).then(function () {
                return res.send(200);
            }).catch(next);
    }
);
