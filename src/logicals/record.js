'use strict';

var knex = require('../lib/knex');

exports.find = function (opts) {
    opts.query = opts.query || {};
    var ret = knex('records').where(opts.query).select();

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

    if (opts.limit) {
        ret = ret.limit(opts.limit);
    }

    if(opts.period){
        var beginTime = opts.period.begin;
        var endTime = opts.period.end;
        console.log('begin: ', beginTime.getFullYear(), '年', beginTime.getMonth()+1, '月', beginTime.getDate(), '日 ', beginTime.getHours(), ':', beginTime.getMinutes(), ':', beginTime.getSeconds());
        console.log('end: ', endTime.getFullYear(), '年', endTime.getMonth()+1, '月', endTime.getDate(), '日 ', endTime.getHours(), ':', endTime.getMinutes(), ':', endTime.getSeconds());

    }

    return ret;
};

exports.get = function (id) {
    return knex('records').first().where('id', id);
};

exports.save = function (obj) {
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;
    return knex('records').insert(obj).returning('id').then(function (ret) {
        return ret[0];
    });
};

exports.update = function (id, obj) {
    obj.updated_at = new Date();
    return knex('records').where('id', id).update(obj);
};

exports.remove = function (id) {
    return knex('records').where('id', id).del();
};
