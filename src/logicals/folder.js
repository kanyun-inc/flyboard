'use strict';

var knex = require('../lib/knex');

exports.find = function (query) {
    query = query || {};
    return knex('folders').where(query).select();
};

exports.get = function (id) {
    return knex('folders').first().where('id', id);
};

exports.save = function (obj) {
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;
    return knex('folders').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    obj.updated_at = new Date();
    return knex('folders').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('folders').where('id', id).del();
};
