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
            var ret = knex('projects').select();

            if(role.scope === 1){
                ret = ret.whereIn('id', projectIds);
            }

            return ret;
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
    delete obj.created_at;
    obj.updated_at = new Date();

    return knex('projects').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('projects').where('id', id).del();
};
