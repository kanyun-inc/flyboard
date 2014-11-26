'use strict';

var knex = require('../lib/knex');

exports.find = function (query){
    query = query || {};
    return knex('user_role').where(query).select();
};

exports.get = function (id) {
    return knex('user_role').first().where('id', id);
};

exports.save = function (obj) {
    return knex('user_role').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    return knex('user_role').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('user_role').where('id', id).del();
};