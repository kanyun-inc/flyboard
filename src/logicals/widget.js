'use strict';

var knex = require('../lib/knex');

exports.find = function () {
    return knex('widgets').select();
};

exports.get = function (id) {
    return knex('widgets').first().where('id', id);
};

exports.save = function (obj) {
    obj.config = JSON.stringify(obj.config);
    return knex('widgets').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    return knex('widgets').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('widgets').where('id', id).del();
};
