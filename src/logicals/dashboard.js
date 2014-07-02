'use strict';

var knex = require('../lib/knex');
var _ = require('underscore');

function objToDb(dashboard) {
    if (!dashboard) {
        return dashboard;
    }

    var newWidget = {};
    if (dashboard.config) {
        newWidget.config = JSON.stringify(dashboard.config || {});
    }

    return _.defaults(newWidget, dashboard);
}

function dbToObj(dashboard) {
    if (!dashboard) {
        return dashboard;
    }

    return _.extend({}, dashboard, {
        config: JSON.parse(dashboard.config || '{}')
    });
}

exports.find = function () {
    return knex('dashboards').select().map(dbToObj);
};

exports.get = function (id) {
    return knex('dashboards').first().where('id', id).then(dbToObj);
};

exports.save = function (obj) {
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;

    return knex('dashboards').insert(objToDb(obj)).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    var data = objToDb(obj);
    data.updated_at = new Date();
    return knex('dashboards').where('id', id).update(data);
};

exports.remove = function (id) {
    return knex('dashboards').where('id', id).del();
};
