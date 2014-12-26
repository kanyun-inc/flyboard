'use strict';

var Role = require('../logicals/role');
var UserRole = require('../logicals/userRole');
var RolePrivilege = require('../logicals/rolePrivilege');
var blueBird = require('bluebird');

exports.vertifyProjectAuthority = function (userId, projectId) {
    if(!userId){
        return blueBird.resolve(false);
    }

    var projectIds = [];

    return UserRole.find({
        user_id: userId
    }).then(function (userRoles) {
        if (userRoles.length === 0) {
            return false;
        }

        projectIds = userRoles.map(function (userRole) {
            return userRole.project_id;
        });

        return userRoles[0].role_id;
    }).then(function (roleId) {
        return Role.get(roleId);
    }).then(function (role) {
        //global authority
        if (role.scope === 2) {
            return true;
        }
        //local authority
        else if (role.scope === 1) {
            if(!projectId){
                return true;
            }

            return projectIds.some(function (id) {
                if (id === projectId) {
                    return true;
                }
            });
        }

        return false;
    });
};

exports.vertifyOperationAuthority = function (userId, resource, operation) {
    if(!userId || !resource || !operation){
        return blueBird.resolve(false);
    }

    return UserRole.find({
        user_id: userId
    }).then(function (userRoles){
        if(userRoles.length === 0){
            return false;
        }

        return userRoles[0].role_id;
    }).then(function (roleId){
        return RolePrivilege.find({
            role_id: roleId,
            resource: resource,
            operation: operation
        }).then(function (rolePrivileges){
            return rolePrivileges.length > 0;
        });
    });
};