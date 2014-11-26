'use strict';

var router = require('express').Router();
module.exports = router;

var RolePrivilege = require('../logicals/rolePrivilege');

router.get('/api/role_privileges/:role_id', function(req, res, next){
    var roleId = parseInt(req.param('role_id'), 10);

    RolePrivilege.find({
        role_id: roleId
    }).then(function (rolePrivileges){
        return res.send(rolePrivileges);
    }).catch(next);
});