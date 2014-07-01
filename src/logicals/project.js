'use strict';

var knex = require('../lib/knex');
var uuid = require('node-uuid');

exports.find = function () {
    return knex('projects').select();
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
