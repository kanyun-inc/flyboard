'use strict';

var knex = require('../lib/knex');

exports.find = function () {
    return knex('projects').select();
};

exports.get = function (id) {
    return knex('projects').first().where('id', id);
};

exports.save = function (obj) {
    return knex('projects').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    return knex('projects').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('projects').where('id', id).del();
};
