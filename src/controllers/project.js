'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var Project = require('../logicals/project');

router.get('/api/projects', function (req, res, next) {
    Project.find().then(function (projects) {
        res.send(projects);
    }).catch(next);
});

router.get('/api/projects/:id', function (req, res, next) {
    var id = parseInt(req.param('id'), 10);

    Project.get(id).then(function (project) {
        if (!project) {
            return res.send(404);
        }

        res.send(project);
    }).catch(next);
});

router.post(
    '/api/projects',
    bodyParser.json(),
    function (req, res, next) {
        var project = req.body;
        if (!project.name) {
            return res.send(400);
        }

        Project.save(project).then(function (id) {
            return Project.get(id);
        }).then(function (project) {
            res.send(project);
        }).catch(next);
    }
);

router.put(
    '/api/projects/:id',
    bodyParser.json(),
    function (req, res, next) {
        var project = req.body;
        if (!project.name) {
            return res.send(400);
        }

        var id = parseInt(req.param('id'), 10);

        Project.update(id, project).then(function () {
            return Project.get(id);
        }).then(function (project) {
            res.send(project);
        }).catch(next);
    }
);

router.delete(
    '/api/projects/:id',
    function (req, res, next) {
        var id = parseInt(req.param('id'), 10);

        Project.remove(id).then(function () {
            res.send(200);
        }).catch(next);
    }
);
