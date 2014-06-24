'use strict';

var knex = require('../lib/knex');

exports.find = function () {
    return knex('dashboards').select();
};

exports.get = function (id) {
    return knex('dashboards').first().where('id', id);
};

exports.save = function (obj) {
    return knex('dashboards').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    return knex('dashboards').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('dashboards').where('id', id).del();
};
