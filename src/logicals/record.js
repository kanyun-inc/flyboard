'use strict';

var knex = require('../lib/knex');
var blueBird = require('bluebird');
var DataSource = require('../logicals/dataSource');

exports.find = function (options) {
    var opts = options || {};

    opts.query = (opts && opts.query) || {};
    var ret = knex('records').where(opts.query).select();

    if(opts.count){
        ret = ret.limit(opts.count);
    }

    if (opts.period) {
        var beginTime = opts.period.begin;
        var endTime = opts.period.end;
        ret = ret.whereBetween('date_time', [beginTime, endTime]);
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

    if (opts.distinct) {
        ret = ret.distinct(opts.distinct);

        return ret.then(function (objs) {
            return objs.map(function (obj) {
                return obj[opts.distinct];
            }).filter(function (value) {
                return value !== null;
            });
        });
    }

    var limitDateTimes = [];
    if (opts.limit) {
        limitDateTimes =  knex('records')
            .where({
                data_source_id: opts.query.data_source_id
            })
            .distinct('date_time').orderBy('date_time', 'desc').limit(opts.limit)
            .then(function (objs) {
            return objs.map(function (obj) {
                return obj.date_time;
            });
        });
    }

    return blueBird.resolve(limitDateTimes).then(function (limitDateTimes) {
        if (opts.limit && limitDateTimes && limitDateTimes.length) {
            ret = ret.whereIn('date_time', limitDateTimes);
        }

        return ret.then(function (records) {
            if(!records || records.length === 0){
                return records;
            }

            var dataSource = DataSource.get(records[0].data_source_id);

            return dataSource.then(function (dataSource) {
                if(!dataSource.config.dimensions || dataSource.config.dimensions.length === 0) {
                    return records;
                }

                records.forEach(function (record) {
                    dataSource.config.dimensions.forEach(function (dimension, idx) {
                        record[dimension.key] = record['dim' + (idx + 1)];
                        delete record['dim' + (idx + 1)];
                    });
                });

                return records;
            });
        });
    });
};

exports.get = function (id) {
    return knex('records').first().where('id', id).then(function (obj) {
        if (!obj) {
            return;
        }

        return DataSource.get(obj.data_source_id)
            .then(function (dataSource) {
                if(dataSource.config.dimensions && dataSource.config.dimensions.length){
                    dataSource.config.dimensions.forEach(function (dimension, idx) {
                        obj[dimension.key] = obj['dim' + (idx + 1)];
                        delete obj['dim' + (idx + 1)];
                    });
                }

                return obj;
            });
    });
};

exports.save = function (obj) {
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;
    obj.date_time = new Date(obj.year || 0, (obj.month - 1) || 0, obj.day || 0, obj.hour || 0, obj.minute || 0, obj.second || 0);

    return DataSource.get(obj.data_source_id).then(function (dataSource) {
        if (dataSource.config && dataSource.config.dimensions) {
            dataSource.config.dimensions.forEach(function (dim, idx) {
                obj['dim' + (idx + 1)] = obj[dim.key] || null;
                delete obj[dim.key];
            });
        }

        return knex('records').insert(obj).returning('id').then(function (ret) {
            return ret[0];
        });
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

exports.removeList = function (dataSourceId, query) {
    query = query || {};

    return knex('records').where('data_source_id', dataSourceId).where(query).del();
};