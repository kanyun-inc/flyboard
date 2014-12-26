'use strict';

var router = require('express').Router();
module.exports = router;

var Role = require('../logicals/role');
var UserRole = require('../logicals/userRole');
var RolePrivilege = require('../logicals/rolePrivilege');
var bodyParser = require('body-parser');
var blueBird = require('bluebird');

router.get('/api/roles', function (req, res, next){
    Role.find().then(function (roles){
        return res.send(roles);
    }).catch(next);
});

router.get('/api/roles/:id', function(req, res, next){
    var id = parseInt(req.param('id'), 10);

    Role.get(id).then(function (role){
        if (!role) {
            return res.send(404);
        }
        return res.send(role);
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
            return res.send(role);
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
            return res.send(role);
        }).catch(next);
    }
);

router.delete('/api/roles/:id', function (req, res, next){
    var id = parseInt(req.param('id'), 10);

    Role.get(id).then(function (role){
        if(!role){
            return res.send(404);
        }

        return UserRole.find({
            role_id: role.id
        });
    }).then(function (userRoles){
        var pros = userRoles.map(function (userRole){
            return UserRole.remove(userRole.id);
        });

        return blueBird.all(pros);
    }).then(function (){
        return RolePrivilege.remove({
            role_id: id
        });
    }).then(function () {
        return Role.remove(id);
    }).then(function (){
        return res.send(200);
    }).catch(next);
});