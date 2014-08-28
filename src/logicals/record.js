'use strict';

var knex = require('../lib/knex');
var blueBird = require('bluebird');
var DataSource = require('../logicals/dataSource');

exports.find = function (options) {
    var opts = options || {};
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

    return ret.then(function (records){
        var dataSourceIds = [];

        records.forEach(function (record) {
            var ret = dataSourceIds.some(function (id) {
                if(id === record.data_source_id){
                    return true;
                }
            });

            if(!ret){
                dataSourceIds.push(record.data_source_id);
            }
        });

         var dataSources = dataSourceIds.map(function (id) {
            return DataSource.get(id).then(function (dataSource) {
                return dataSource;
            });
        });

        return blueBird.all(dataSources).then(function (results) {
            var dataSources = results.reduce(function (memo, curr) {
                memo[curr.id] = curr;
                return memo;
            }, {});

            records.forEach(function (record) {
                var dataSource = dataSources[record.data_source_id];

                if(record.dim1) {
                    record[dataSource.config.dimensions[0].key] = record.dim1;
                    delete record.dim1;
                }
                if(record.dim2) {
                    record[dataSource.config.dimensions[1].key] = record.dim2;
                    delete record.dim2;
                }
            });

            return records;
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
                if(obj.dim1) {
                    obj[dataSource.config.dimensions[0].key] = obj.dim1;
                    delete obj.dim1;
                }
                if(obj.dim2) {
                    obj[dataSource.config.dimensions[1].key] = obj.dim2;
                    delete obj.dim2;
                }

                return obj;
            });
    });
};

exports.save = function (obj) {
    obj.created_at = new Date();
    obj.updated_at = obj.created_at;
    obj.date_time = new Date(obj.year || 0, (obj.month - 1) || 0, obj.day || 0, obj.hour || 0, obj.minute || 0, obj.second || 0);

    var dimensions = [];
    return DataSource.get(obj.data_source_id).then(function (dataSource) {
        if(dataSource.config && dataSource.config.dimensions) {
            dataSource.config.dimensions.forEach(function (dim) {
                dimensions.push(obj[dim.key]);
                delete obj[dim.key];
            });

            obj.dim1 = dimensions[0] || null;
            obj.dim2 = dimensions[1] || null;
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
