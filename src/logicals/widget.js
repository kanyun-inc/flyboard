'use strict';

var knex = require('../lib/knex');
var _ = require('underscore');

function objToDb(widget) {
    if (!widget) {
        return widget;
    }

    return _.extend({}, widget, {
        config: JSON.stringify(widget.config)
    });
}

function dbToObj(widget) {
    if (!widget) {
        return widget;
    }

    return _.extend({}, widget, {
        config: JSON.parse(widget.config)
    });
}

exports.find = function () {
    return knex('widgets').select().map(dbToObj);
};

exports.get = function (id) {
    return knex('widgets').first().where('id', id).then(dbToObj);
};

exports.save = function (obj) {
    return knex('widgets').insert(objToDb(obj)).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    return knex('widgets').where('id', id).update(objToDb(obj));
};

exports.remove = function (id) {
    return knex('widgets').where('id', id).del();
};
