'use strict';

var knex = require('../lib/knex');
var _ = require('underscore');

function objToDb(dataSource) {
    if (!dataSource) {
        return dataSource;
    }

    var newDataSource = {};
    if (dataSource.config) {
        newDataSource.config = JSON.stringify(dataSource.config || {});
    }

    return _.defaults(newDataSource, dataSource);
}

function dbToObj(dataSource) {
    if (!dataSource) {
        return dataSource;
    }

    return _.extend({}, dataSource, {
        config: JSON.parse(dataSource.config || '{}')
    });
}

exports.find = function (query) {
    query = query || {};
    return knex('data_sources').where(query).select().map(dbToObj);
};

exports.getByUUIDAndKey = function (uuid, key) {
    return knex('data_sources')
        .join('projects', 'projects.id', '=', 'data_sources.project_id')
        .where({
            'projects.uuid': uuid,
            'data_sources.key': key
        }).select('data_sources.id').first();
};

exports.get = function (id) {
    return knex('data_sources').first().where('id', id).then(dbToObj);
};

exports.save = function (obj) {
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;
    return knex('data_sources').insert(objToDb(obj)).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    obj.updated_at = new Date();
    delete obj.config;
    return knex('data_sources').where('id', id).update(objToDb(obj));
};

exports.remove = function (id) {
    return knex('data_sources').where('id', id).del();
};
