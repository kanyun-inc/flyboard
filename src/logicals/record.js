'use strict';

var knex = require('../lib/knex');

exports.find = function (query, limit) {
    query = query || {};
    var ret = knex('records').where(query).select();

    if (limit) {
        ret = ret.limit(limit);
    }

    return ret;
};

exports.get = function (id) {
    return knex('records').first().where('id', id);
};

exports.save = function (obj) {
    return knex('records').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    return knex('records').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('records').where('id', id).del();
};
