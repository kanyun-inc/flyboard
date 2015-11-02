'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var UserRole = require('../logicals/userRole');
var User = require('../logicals/user');
var Role = require('../logicals/role');
var Project = require('../logicals/project');
var blueBird = require('bluebird');

//get  user_roles for all users or one user according to user_id
router.get('/api/user_roles', function (req, res, next) {
    var userId = req.query['user_id'] ? parseInt(req.query['user_id'], 10) : null;
    var roleId = req.query['role_id'] ? parseInt(req.query['role_id'], 10) : null;
    var projectId = req.query['project_id'] ? parseInt(req.query['project_id'], 10) : null;
    var query = {};

    if(userId){
        query.user_id = userId;
    }
    if(roleId){
        query.role_id = roleId;
    }
    if(projectId || projectId === 0){
        query.project_id = projectId;
    }

    UserRole.find(query).then(function (userRoles) {
        return res.send(userRoles);
    }).catch(next);
});

router.get('/api/user_roles/:id', function(req, res, next){
    var id = parseInt(req.params['id'], 10);

    UserRole.get(id).then(function (userRole){
        if (!userRole) {
            return res.send(404);
        }
        return res.send(userRole);
    }).catch(next);
});

router.post(
    '/api/user_roles',
    bodyParser.json(),
    function (req, res, next) {
        var userRole = req.body;

        if(!userRole || !userRole.user_id || !userRole.role_id || (!userRole.project_id && userRole.project_id !== 0)){
            return res.send(400);
        }

        User.get(userRole.user_id)
            .then(function (user){
            if(!user){
                return res.send(404);
            }
        }).then(function (){
            return Role.get(userRole.role_id)
                .then(function (role){
                    if(!role){
                        return res.send(404);
                    }
                });
        }).then(function () {
            if(userRole.project_id){
                return Project.get(userRole.project_id)
                    .then(function (project){
                        if(!project){
                            return res.send(404);
                        }
                    });
            }
            else{
                return blueBird.resolve(null);
            }
        }).then(function () {
            return UserRole.save(userRole)
                .then(function (id){
                    return UserRole.get(id)
                        .then(function (userRole){
                            return res.send(userRole);
                        });
                });
        }).catch(next);
});

router.put(
    '/api/user_roles/:id',
    bodyParser.json(),
    function(req, res, next){
        var userRole = req.body;
        var id = parseInt(req.params['id'], 10);

        //check id validity
        UserRole.get(id)
        .then(function (ret) {
            if (!ret) {
                return res.send(404);
            }

            //check data validity
            if (!userRole || !userRole.user_id || !userRole.role_id || (!userRole.project_id && userRole.project_id !== 0)) {
                return res.send(400);
            }

            return User.get(userRole.user_id);
        }).then(function (user) {
                if (!user) {
                    return res.send(404);
                }

                return Role.get(userRole.role_id);
        }).then(function (role){
            if(!role){
                return res.send(404);
            }

            if(userRole.project_id){
                return Project.get(userRole.project_id)
                    .then(function (project){
                        if(!project){
                            return res.send(404);
                        }
                    });
            }
            else{
                return blueBird.resolve(null);
            }
        }).then(function () {
            return UserRole.save(userRole)
                .then(function (id){
                    return UserRole.get(id)
                        .then(function (userRole){
                            return res.send(userRole);
                        });
                });
        }).then(function (){
            UserRole.update(id, userRole).then(function () {
                return UserRole.get(id);
            }).then(function (userRole) {
                return res.send(userRole);
            });
        }).catch(next);
    }
);

router.delete(
    '/api/user_roles/:id',
    function(req, res, next){
        var id = parseInt(req.params['id'], 10);

        UserRole.remove(id).then(function(){
            return res.send(200);
        }).catch(next);
    }
);
