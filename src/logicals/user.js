'use strict';

var knex = require('../lib/knex');
var Role = require('./role');
var UserRole = require('./userRole');
var randomString = require('randomstring');

exports.find = function (query){
    query = query || {};
    return knex('users').where(query).select();
};

exports.findOne = function(query) {
    query = query || {};
    return knex('users').where(query).select().first();
};

exports.get = function (id) {
    return knex('users').first().where('id', id);
};

exports.save = function (obj) {
    obj.salt = randomString.generate();
    return knex('users').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    return knex('users').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('users').where('id', id).del();
};

exports.findOrCreate = function (query) {
    query = query || {};

    return exports.find({
        email: query.email
    }).then(function (users) {
        var userId = null;

        // user exists
        if(users && users.length > 0){
            return users[0];
        }

        return exports.save({
            email: query.email
        }).then(function (id){
            userId = id;

            return exports.find();
        }).then(function (rets){
            if(!rets || rets.length !== 1 || rets[0].id !== userId) {
                return ;
            }

            // if this is the first user, set it as administrator
            return Role.find({
                scope: 2
            }).then(function (rets){
                if(!rets || rets.length === 0){
                    return ;
                }

                return UserRole.save({
                    user_id: userId,
                    role_id: rets[0].id,
                    project_id: 0
                });
            });
        }).then(function (){
            return exports.get(userId);
        });
    });
};

exports.resetSalt = function (id, obj){
    obj.salt = randomString.generate();
    return knex('users').where('id', id).update(obj);
};