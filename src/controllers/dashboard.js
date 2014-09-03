'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var Dashboard = require('../logicals/dashboard');

router.get('/api/dashboards', function(req, res, next){
    Dashboard.find().then(function (dashboards){
        res.send(dashboards);
    }).catch(next);
});

router.get('/api/dashboards/:id', function(req, res, next){
   var id = parseInt(req.param('id'), 10);

    Dashboard.get(id).then(function(dashboards){
        if(!dashboards){
            return res.send(404);
        }

        res.send(dashboards);
    }).catch(next);
});

router.post(
    '/api/dashboards',
    bodyParser.json(),
    function(req, res, next){
        var dashboard = req.body;
        if(!dashboard.name) {
            return res.send(404);
        }

        Dashboard.save(dashboard).then(function(id){
            return Dashboard.get(id);
        }).then(function(dashboard){
            res.send(dashboard);
        }).catch(next);
    }
);

router.put(
    '/api/dashboards/:id',
    bodyParser.json(),
    function(req, res, next){
        var dashboard = req.body;
        if (dashboard.name !== undefined && !dashboard.name) {
            res.send(400);
        }

        var id = parseInt(req.param('id'), 10);

        Dashboard.update(id, dashboard).then(function () {
            return Dashboard.get(id);
        }).then(function (dashboard) {
            res.send(dashboard);
        }).catch(next);
    }
);

router.delete(
    '/api/dashboards/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);

        Dashboard.remove(id).then(function(){
            res.send(200);
        }).catch(next);
    }
);
