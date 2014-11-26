'use strict';

var router = require('express').Router();
module.exports = router;

var Role = require('../logicals/role');
var bodyParser = require('body-parser');

router.get('/api/roles', function (req, res, next){
    Role.find().then(function (roles){
        res.send(roles);
    }).catch(next);
});

router.get('/api/roles/:id', function(req, res, next){
    var id = parseInt(req.param('id'), 10);

    Role.get(id).then(function (role){
        if (!role) {
            return res.send(404);
        }
        res.send(role);
    }).catch(next);
});

router.post('/api/roles',
    bodyParser.json(),
    function(req, res, next){
        var role = req.body;

        if(!role || !role.name || !role.scope){
            return res.send(400);
        }

        Role.save(role).then(function (id) {
            return Role.get(id);
        }).then(function (role) {
            res.send(role);
        }).catch(next);
});

router.put('/api/roles/:id',
    bodyParser.json(),
    function (req, res, next){
        var id = parseInt(req.param('id'), 10);
        var role = req.body;

        if(!role || !role.name || !role.scope){
            return res.send(400);
        }

        Role.update(id, role).then(function (id){
            return Role.get(id);
        }).then(function (role){
            res.send(role);
        }).catch(next);
    }
);

router.delete('/api/roles/:id', function (req, res, next){
    var id = parseInt(req.param('id'), 10);

    Role.remove(id).then(function (){
        res.send(200);
    }).catch(next);
});