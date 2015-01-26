'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var Dashboard = require('../logicals/dashboard');
var Widget = require('../logicals/widget');
var apiAuthFilter = require('./apiAuthFilter');

router.get(
    '/api/dashboards/:dashboardId/widgets',
    function(req, res, next){
        var dashboardId = parseInt(req.param('dashboardId'), 10);
        var userId = req.user ? req.user.id : null;

        Dashboard.get(dashboardId)
            .then(function (dashboard) {
                if (!dashboard) {
                    return res.send(404);
                }
                return apiAuthFilter.vertifyProjectAuthority(userId, dashboard.project_id);
            }).then(function (authResult){
                if(!authResult){
                    return res.send(403);
                }

                return Widget.find({
                    dashboard_id: dashboardId
                });
            }).then(function(widgets){
                return res.send(widgets);
            }).catch(next);
    }
);

router.get(
    '/api/dashboards/:dashboardId/widgets/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);
        var dashboardId = parseInt(req.param('dashboardId'), 10);
        var userId = req.user ? req.user.id : null;

        Dashboard.get(dashboardId)
            .then(function (dashboard){
                if(!dashboard){
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dashboard.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }
                return Widget.get(id);
            }).then(function(widget) {
                if (!widget) {
                    return res.send(404);
                }

                return res.send(widget);
            }).catch(next);
    }
);

router.post(
    '/api/dashboards/:dashboardId/widgets',
    bodyParser.json(),
    function(req, res, next) {
        var dashboardId = parseInt(req.param('dashboardId'), 10);
        var userId = req.user ? req.user.id : null;
        var widget = req.body;

        if (!widget.dashboard_id || !widget.type || !widget.config) {
            return res.send(400);
        }

        Dashboard.get(dashboardId)
            .then(function (dashboard) {
                if(!dashboard){
                    return res.send(400);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dashboard.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Widget.save(widget);
            }).then(function(id){
                return Widget.get(id);
            }).then(function(widget){
                return res.send(widget);
            }).catch(next);
    }
);

router.put(
    '/api/dashboards/:dashboardId/widgets/:id',
    bodyParser.json(),
    function(req, res, next) {
        var id = parseInt(req.param('id'), 10);
        var dashboardId = parseInt(req.param('dashboardId'), 10);
        var userId = req.user ? req.user.id : null;
        var widget = req.body;

        if(!widget.type && !widget.config){
            return res.send(400);
        }

        Dashboard.get(dashboardId)
            .then(function (dashboard){
                if(!dashboard){
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dashboard.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Widget.update(id, widget);
            }).then(function(){
                return Widget.get(id);
            }).then(function(widget){
                return res.send(widget);
            }).catch(next);
    }
);

router.delete(
    '/api/dashboards/:dashboardId/widgets/:id',
    function(req, res, next) {
        var id = parseInt(req.param('id'), 10);
        var dashboardId = parseInt(req.param('dashboardId'), 10);
        var userId = req.user ? req.user.id : null;

        Dashboard.get(dashboardId)
            .then(function (dashboard){
                if(!dashboard){
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dashboard.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Widget.remove(id);
            }).then(function(){
                return res.send(200);
            }).catch(next);
    }
);
