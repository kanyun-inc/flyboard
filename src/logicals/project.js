'use strict';

var knex = require('../lib/knex');
var uuid = require('node-uuid');
var Role = require('./role');
var UserRole = require('./userRole');

exports.find = function (query) {
    query = query || {};

    if(query.user_id){
        var projectIds = [];

        return UserRole.find({
            user_id: query.user_id
        }).then(function (userRoles){
            projectIds = userRoles.map(function (userRole){
                return userRole.project_id;
            });

            return Role.get(userRoles[0].role_id);
        }).then(function (role){
            if(role.scope === 2){
                return knex('projects').select();
            }
            else{
                return knex('projects').whereIn('id', projectIds).select();
            }
        });
    }
    else{
        return knex('projects').select();
    }
};

exports.get = function (id) {
    return knex('projects').first().where('id', id);
};

exports.save = function (obj) {
    obj.uuid = uuid.v1();
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;
    return knex('projects').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    obj.updated_at = new Date();
    return knex('projects').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('projects').where('id', id).del();
};
