'use strict';

var knex = require('../lib/knex');
var _ = require('underscore');
var blueBird = require('bluebird');

function objToDb(dashboard) {
    if (!dashboard) {
        return dashboard;
    }

    var newDashboard = {};
    if (dashboard.config) {
        newDashboard.config = JSON.stringify(dashboard.config || {});
    }

    return _.defaults(newDashboard, dashboard);
}

function dbToObj(dashboard) {
    if (!dashboard) {
        return dashboard;
    }

    return _.extend({}, dashboard, {
        config: JSON.parse(dashboard.config || '{}')
    });
}

function clone(obj, add) {
    var copyObj = JSON.parse(JSON.stringify(obj));

    if(add){
        Object.keys(add).forEach(function (key){
            copyObj[key] = add[key];
        });
    }

    return copyObj;
}

exports.find = function (query) {
    query = query || {};

    if(query.user_id) {
        var query_public_dashboards = clone(query);
        var query_private_dashboards = clone(query);

        delete query_public_dashboards.user_id;
        delete query_private_dashboards.user_id;

        query_private_dashboards.owner_id = query.user_id;

        return blueBird.all([
            knex('dashboards')
                .where(query_public_dashboards)
                .whereNull('private')
                .orWhere(query_public_dashboards)
                .andWhere('private', false)
                .select()
                .map(dbToObj),
            knex('dashboards')
                .where(query_private_dashboards)
                .where('private', true)
                .select()
                .map(dbToObj)
        ]).then(function (rets){
            return rets[0].concat(rets[1]);
        });
    }
    else{
        return knex('dashboards').where(query).select().map(dbToObj);
    }
};

exports.get = function (id) {
    return knex('dashboards').first().where('id', id).then(dbToObj);
};

exports.save = function (obj) {
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;
    obj.private = obj.private ? true: false;

    if(!obj.user_id){
        obj.private = false;
        obj.owner_id = null;
    }
    else if(obj.user_id && obj.private) {
          obj.owner_id = obj.user_id;
    }
    delete obj.user_id;

    return knex('dashboards').insert(objToDb(obj)).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    obj.private = obj.private === true;
    obj.updated_at = new Date();

    if(!obj.user_id){
        obj.private = false;
        obj.owner_id = null;
    }
    else if(obj.user_id && obj.private) {
        obj.owner_id = obj.user_id;
    }
    delete obj.user_id;

    return knex('dashboards').where('id', id).update(objToDb(obj));
};

exports.remove = function (id) {
    return knex('dashboards').where('id', id).del();
};
