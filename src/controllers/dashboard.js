'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var Dashboard = require('../logicals/dashboard');
var Project = require('../logicals/project');

router.get('/api/dashboards', function(req, res, next){
    var projectId = req.param('project_id') ? parseInt(req.param('project_id', 10)) : null;
    var userId = req.user ? req.user.id : null;
    var query = {};

    if(projectId) {
        query.project_id = projectId;
    }
    if(userId){
        query.user_id = userId;
    }

    Dashboard.find(query).then(function (dashboards){
        return res.send(dashboards);
    }).catch(next);
});

router.get('/api/dashboards/:id', function(req, res, next){
   var id = parseInt(req.param('id'), 10);

    Dashboard.get(id).then(function(dashboards){
        if(!dashboards){
            return res.send(404);
        }

        return res.send(dashboards);
    }).catch(next);
});

router.post(
    '/api/dashboards',
    bodyParser.json(),
    function(req, res, next){
        var dashboard = req.body;
        var userId = req.user ? req.user.id : null;

        if(!dashboard.name || !dashboard.project_id) {
            return res.send(400);
        }

        if(userId){
            dashboard.user_id = userId;
        }

        Project.get(dashboard.project_id)
            .then(function(project) {
                if(!project){
                    return res.send(404);
                }
        }).then(function (){
            return Dashboard.save(dashboard).then(function(id){
                return Dashboard.get(id);
            }).then(function(dashboard) {
                return res.send(dashboard);
            });
        }).catch(next);
    }
);

router.put(
    '/api/dashboards/:id',
    bodyParser.json(),
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;

        console.log('@@@EDIT_DASHBOARD@@@ ' + JSON.stringify(req.body));
        var dashboard = req.body;
        if (dashboard.name !== undefined && !dashboard.name) {
            return res.status(400).send('dashboard.name 不能为空');
        }else if(!dashboard.project_id){
            return res.status(400).send('dashboard.project_id 不能为空');
        } else if (!dashboard.config || !dashboard.config.layout || !dashboard.config.layout.length) {
            return res.status(400).send('dashboard.config.layout 不能为空');
        }

        if(userId){
            dashboard.user_id = userId;
        }

        Project.get(dashboard.project_id)
            .then(function(project) {
                if(!project){
                    return res.send(404);
                }
        }).then(function (){
            return Dashboard.update(id, dashboard).then(function () {
                return Dashboard.get(id);
            }).then(function (dashboard) {
                return res.send(dashboard);
            });
        }).catch(next);
    }
);

router.delete(
    '/api/dashboards/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);

        Dashboard.remove(id).then(function(){
            return res.send(200);
        }).catch(next);
    }
);
