'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var User = require('../logicals/user');

router.get('/api/users', function (req, res, next) {
    User.find().then(function (users) {
        return res.send(users);
    }).catch(next);
});

router.get('/api/users/:id', function (req, res, next) {
    var id = parseInt(req.param('id'), 10);

    User.get(id).then(function (user) {
        if (!user) {
            return res.send(404);
        }

        return res.send(user);
    }).catch(next);
});

router.post(
    '/api/users',
    bodyParser.json(),
    function (req, res, next) {
        var user = req.body;
        if (!user || !user.email) {
            return res.send(400);
        }

        User.save(user).then(function (id) {
            return User.get(id);
        }).then(function (user) {
            return res.send(user);
        }).catch(next);
    }
);

router.put(
    '/api/users/:id',
    bodyParser.json(),
    function (req, res, next) {
        var user = req.body;
        if (!user || !user.email) {
            return res.send(400);
        }

        var id = parseInt(req.param('id'), 10);

        User.update(id, user).then(function () {
            return User.get(id);
        }).then(function (user) {
            return res.send(user);
        }).catch(next);
    }
);

router.delete(
    '/api/users/:id',
    function (req, res, next) {
        var id = parseInt(req.param('id'), 10);

        User.remove(id).then(function () {
            return res.send(200);
        }).catch(next);
    }
);