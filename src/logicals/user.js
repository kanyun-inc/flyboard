'use strict';

var knex = require('../lib/knex');
var blueBird = require('bluebird');
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

    var ret = exports.find({
        email: query.email
    });

    return blueBird.resolve(ret).then(function (users) {
        if(users && users.length){
            //user exists
            return users[0];
        }
        else{
            //user not exist
            var ret = exports.save({
                email: query.email
            });

            return blueBird.resolve(ret).then(function (id) {
                return exports.get(id);
            });
        }
    });
};