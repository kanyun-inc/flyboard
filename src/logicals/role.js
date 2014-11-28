'use strict';

var knex = require('../lib/knex');

exports.find = function (query){
    query = query || {};
    return knex('roles').where(query).select();
};

exports.get = function (id) {
    return knex('roles').first().where('id', id);
};

exports.save = function (obj) {
    return knex('roles').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    return knex('roles').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('roles').where('id', id).del();
};