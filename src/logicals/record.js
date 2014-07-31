'use strict';

var knex = require('../lib/knex');

exports.find = function (opts) {
    opts.query = (opts && opts.query) || {};
    var ret = knex('records').where(opts.query).select();

    if(opts.period){
        var beginTime = opts.period.begin;
        var endTime = opts.period.end;
        ret = ret.whereBetween('date_time', [beginTime, endTime]);
    }

    if (opts.limit) {
        ret = ret.limit(opts.limit);
    }

    if (!opts.orderBy) {
        ret = ret.orderBy('year', 'desc')
            .orderBy('month', 'desc')
            .orderBy('day', 'desc')
            .orderBy('hour', 'desc')
            .orderBy('minute', 'desc')
            .orderBy('second', 'desc');
    } else {
        ret = ret.orderBy(opts.orderBy, 'desc');
    }

    return ret;
};

exports.get = function (id) {
    return knex('records').first().where('id', id);
};

exports.save = function (obj) {
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;
    obj.date_time = new Date(obj.year || 0, (obj.month - 1) || 0, obj.day || 0, obj.hour || 0, obj.minute || 0, obj.second || 0);
    return knex('records').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    obj.updated_at = new Date();
    obj.date_time = new Date(obj.year || 0, (obj.month - 1) || 0, obj.day || 0, obj.hour || 0, obj.minute || 0, obj.second || 0);
    return knex('records').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('records').where('id', id).del();
};
