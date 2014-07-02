'use strict';

var knex = require('../lib/knex');
var _ = require('underscore');

function objToDb(widget) {
    if (!widget) {
        return widget;
    }

    var newWidget = {};
    if (widget.config) {
        newWidget.config = JSON.stringify(widget.config || {});
    }

    return _.defaults(newWidget, widget);
}

function dbToObj(widget) {
    if (!widget) {
        return widget;
    }

    return _.extend({}, widget, {
        config: JSON.parse(widget.config)
    });
}

exports.find = function (query) {
    query = query || {};
    return knex('widgets').where(query).select().map(dbToObj);
};

exports.get = function (id) {
    return knex('widgets').first().where('id', id).then(dbToObj);
};

exports.save = function (obj) {
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;
    return knex('widgets').insert(objToDb(obj)).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    obj.updated_at = new Date();
    return knex('widgets').where('id', id).update(objToDb(obj));
};

exports.remove = function (id) {
    return knex('widgets').where('id', id).del();
};
