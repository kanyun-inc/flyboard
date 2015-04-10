'use strict';

var knex = require('../lib/knex');
var _ = require('underscore');
var blueBird = require('bluebird');
var Role = require('./role');
var UserRole = require('./userRole');

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
        var projectIds = [];
        var publicFilter = query.public_filter;
        var privateFilter = query.private_filter;
        delete query.public_filter;
        delete query.private_filter;

        return UserRole.find({
            user_id: query.user_id
        }).then(function (userRoles){
            projectIds = userRoles.map(function (userRole){
                return userRole.project_id;
            });

            return Role.get(userRoles[0].role_id);
        }).then(function (role){
            var query_public_dashboards = clone(query);
            var query_private_dashboards = clone(query);

            delete query_public_dashboards.user_id;
            delete query_private_dashboards.user_id;

            query_private_dashboards.owner_id = query.user_id;
            delete query.user_id;

            var ret_public = publicFilter ?
                knex('dashboards')
                    .where(query_public_dashboards)
                    .whereNull('private')
                    .orWhere('private', false)
                    .andWhere(query_public_dashboards)
                    .select()
                : null;
            var ret_private = privateFilter ?
                knex('dashboards')
                    .where(query_private_dashboards)
                    .where('private', true)
                    .select()
                : null;

            //local scope
            if(role.scope === 1){
                ret_public = ret_public ? ret_public.whereIn('project_id', projectIds) : null;
                ret_private = ret_private ? ret_private.whereIn('project_id', projectIds) : null;
            }

            ret_public = ret_public ? ret_public.map(dbToObj) : ret_public;
            ret_private = ret_private ? ret_private.map(dbToObj) : ret_private;

            return blueBird.all([
                ret_public,
                ret_private
            ]).then(function (rets){
                if(rets[0] && rets[1]){
                    return rets[0].concat(rets[1]);
                }

                return rets[0] ? rets[0] : rets[1];
            });
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
    obj.private = obj.private ? true : false;

    if(obj.user_id){
        if(!obj.private){
            obj.owner_id = null;
        }
        else{
            obj.owner_id = obj.user_id;
        }

        delete obj.user_id;
    }

    return knex('dashboards').insert(objToDb(obj)).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    obj.private = obj.private ? true : false;
    delete obj.created_at;
    obj.updated_at = new Date();

    if(obj.user_id){
        if(!obj.private){
            obj.owner_id = null;
        }
        else{
            obj.owner_id = obj.user_id;
        }

        delete obj.user_id;
    }

    return knex('dashboards').where('id', id).update(objToDb(obj));
};

exports.remove = function (id) {
    return knex('dashboards').where('id', id).del();
};
