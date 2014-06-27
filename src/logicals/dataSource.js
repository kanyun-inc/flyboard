'use strict';

var knex = require('../lib/knex');

exports.find = function (query) {
    query = query || {};
    return knex('data_sources').where(query).select();
};

exports.getByUUIDAndKey = function (uuid, key) {
    return knex('data_sources')
        .join('projects', 'projects.id', '=', 'data_sources.project_id')
        .where({
            'projects.uuid': uuid,
            'data_sources.key': key
        }).first();
};

exports.get = function (id) {
    return knex('data_sources').first().where('id', id);
};

exports.save = function (obj) {
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
