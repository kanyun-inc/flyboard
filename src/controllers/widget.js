'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var Dashboard = require('../logicals/dashboard');
var Widget = require('../logicals/widget');

router.get(
    '/api/dashboards/:dashboardId/widgets',
    function(req, res, next){
        var dashboardId = parseInt(req.param('dashboardId'), 10);
        Widget.find({
            dashboard_id: dashboardId
        }).then(function(widgets){
            res.send(widgets);
        }).catch(next);
    }
);

router.get(
    '/api/dashboards/:dashboardId/widgets/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);

        Widget.get(id).then(function(widget) {
            if (!widget) {
                return res.send(404);
            }

            res.send(widget);
        }).catch(next);
    }
);

router.post(
    '/api/dashboards/:dashboardId/widgets',
    bodyParser.json(),
    function(req, res, next) {
        console.log('@@@CREATE_WIDGET@@@ ' + JSON.stringify(req.body));
        var dashboardId = parseInt(req.param('dashboardId'), 10);
        var widget = req.body;

        Dashboard.get(dashboardId).then(function (dashboard) {
            if(!dashboard){
                return res.send(400);
            }
        });

        if (!widget.dashboard_id || !widget.type || !widget.config) {
            return res.send(400);
        }

        Widget.save(widget).then(function(id){
            return Widget.get(id);
        }).then(function(widget){
            res.send(widget);
        }).catch(next);
    }
);

router.put(
    '/api/dashboards/:dashboardId/widgets/:id',
    bodyParser.json(),
    function(req, res, next) {
        console.log('@@@UPDATE_WIDGET@@@ ' + JSON.stringify(req.body));
        var widget = req.body;
        if(!widget.type && !widget.config){
            return res.send(400);
        }

        var id = parseInt(req.param('id'), 10);

        Widget.update(id, widget).then(function(){
            return Widget.get(id);
        }).then(function(widget){
            res.send(widget);
        }).catch(next);
    }
);

router.delete(
    '/api/dashboards/:dashboardId/widgets/:id',
    function(req, res, next) {
        var id = parseInt(req.param('id'), 10);
        console.log('@@@DELETE_WIDGET@@@ id=' + id);

        Widget.remove(id).then(function(){
            res.send(200);
        }).catch(next);
    }
);
