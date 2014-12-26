'use strict';

var router = require('express').Router();
module.exports = router;

var RolePrivilege = require('../logicals/rolePrivilege');
var bodyParser = require('body-parser');

router.get('/api/role_privileges', function(req, res, next){
    var roleId = parseInt(req.param('role_id'), 10);

    RolePrivilege.find({
        role_id: roleId
    }).then(function (rolePrivileges){
        return res.send(rolePrivileges);
    }).catch(next);
});

router.post(
    '/api/role_privileges',
    bodyParser.json(),
    function (req, res, next){
        var rolePrivilege = req.body;

        if(!rolePrivilege.resource || !rolePrivilege.operation || !rolePrivilege.role_id){
            return res.send(400);
        }

        RolePrivilege.save(rolePrivilege)
            .then(function (){
                return RolePrivilege.findOne(rolePrivilege);
            }).then(function (ret){
                return res.send(ret);
            }).catch(next);
    }
);

router.delete('/api/role_privileges/:role_id', function(req, res, next){
    var roleId = parseInt(req.param('role_id'), 10);

    if(!roleId){
        return res.send(404);
    }

    RolePrivilege.remove({
        role_id: roleId
    }).then(function (){
        return res.send(200);
    }).catch(next);
});