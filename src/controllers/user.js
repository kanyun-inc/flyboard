'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var blueBird = require('bluebird');
var User = require('../logicals/user');
var UserRole = require('../logicals/userRole');
var tokenGenerator = require('./tokenGenerator');

router.get('/api/users/current', function (req, res, next){
    var user = req.user || null;

    if(!user){
        return res.send(404);
    }

    User.findOne({
        email: user.email
    }).then(function (user){
        return res.send(user);
    }).catch(next);
});

router.put(
    '/api/users/token_reset/:id',
    bodyParser.json(),
    function (req, res, next){
        var id = parseInt(req.params('id'), 10);

        User.get(id).then(function (user) {
            if (!user) {
                return res.send(404);
            }

            return User.resetSalt(id, user);
        }).then(function () {
            return User.get(id);
        }).then(function (user) {
            return res.send({
                token:tokenGenerator.generate(user)
            });
        }).catch(next);
    }
);

router.get('/api/users/token/:id', function (req, res, next){
    var id = parseInt(req.params('id'), 10);

    User.get(id).then(function (user){
        if(!user){
            return res.send(404);
        }

        return res.send({
            token: tokenGenerator.generate(user)
        });
    }).catch(next);
});

router.get('/api/users', function (req, res, next) {
    User.find().then(function (users) {
        return res.send(users);
    }).catch(next);
});

router.get('/api/users/:id', function (req, res, next) {
    var id = parseInt(req.params('id'), 10);

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

        var id = parseInt(req.params('id'), 10);

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
        var id = parseInt(req.params('id'), 10);

        User.get(id).then(function (user){
            if(!user){
                return res.send(404);
            }

            return UserRole.find({
                user_id: id
            });
        }).then(function (userRoles){
            var pros = userRoles.map(function (userRole){
                return UserRole.remove(userRole.id);
            });

            return blueBird.all(pros);
        }).then(function () {
            return User.remove(id);
        }).then(function () {
            return res.send(200);
        }).catch(next);
    }
);
