'use strict';

var uuid = require('node-uuid');
var knex = require('../lib/knex');

exports.find = function () {
    return knex('data_sources').select();
};

exports.get = function (id) {
    return knex('data_sources').first().where('id', id);
};

exports.save = function (obj) {
    obj.uuid = uuid.v1();

    return knex('data_sources').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    return knex('data_sources').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('data_sources').where('id', id).del();
};
