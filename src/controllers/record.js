'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var blueBird = require('bluebird');
var iconv = require('iconv-lite');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');
var apiAuthFilter = require('./apiAuthFilter');
var process = require('./util');
var moment = require('moment');

router.post(
    '/api/projects/:uuid/data_sources/:key',
    bodyParser.json(),
    function(req, res, next){
        var record = req.body;
        var uuid = req.param('uuid');
        var key = req.param('key');
        var userId = req.user ? req.user.id : null;
        var dataSourceId = null;
        var projectId = null;

        if(record.value === undefined){
            return res.send(400);
        }

        DataSource.getByUUIDAndKey(uuid, key)
            .then(function (dataSource) {
                if (!dataSource) {
                    return res.send(404);
                }

                dataSourceId = dataSource.id;
                projectId = dataSource.project_id;

                return apiAuthFilter.vertifyProjectAuthority(userId, projectId);
            }).then(function (authResult){
                if(!authResult){
                    return res.send(403);
                }

                return DataSource.get(dataSourceId);
            }).then(function (dataSource) {
                //check if dimensions are the same
                if (dataSource.config && dataSource.config.dimensions) {
                    dataSource.config.dimensions.forEach(function (dim) {
                        if (!record[dim.key]) {
                            return res.send(400);
                        }
                    });
                }

                record.data_source_id = dataSource.id;

                //if the record already exists, replace the old record
//                return Record.findOne(record);
//            }).then(function (ret){
//                if(ret.length !== 0){
//                    var id = ret[0].id;
//
//                    return Record.update(id, record)
//                        .then(function (){
//                            return id;
//                        });
//                }
//                else{
                    return Record.save(record);
//                }
            }).then(function (id) {
                return Record.get(id);
            }).then(function (record) {
                return res.send(record);
            }).catch(next);
    }
);

router.get(
    '/api/records/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;

        Record.get(id)
            .then(function (record){
                if(!record){
                    return res.send(404);
                }

                return DataSource.get(record.data_source_id);
            }).then(function (dataSource){
                if(!dataSource){
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Record.get(id);
            }).then(function (record){
                return res.send(record);
            }).catch(next);
    }
);

router.get(
    '/api/data_sources/:id/records',
    function(req, res, next){
        var dataSourceId = parseInt(req.param('id'), 10);
        var limit = parseInt(req.param('limit') || 0, 10);
        var count = parseInt(req.param('count') || 0, 10);
        var offset = parseInt(req.param('offset') || 0, 10);
        var orderBy = req.param('orderBy') || undefined;
        var distinct = req.param('distinct') || null;
        var periodValue = req.param('period') && req.param('period') !== 'all' ? req.param('period').split(',') : null;
        var period = null;
        var dimensions = JSON.parse(req.param('dimensions') || '[]');
        var userId = req.user ? req.user.id : null;

        if(periodValue && periodValue.length === 2){
            var now = new Date();
            period = {
                begin: moment(now).subtract(parseInt(periodValue[1]), 'days').startOf('day').toDate(),
                end: periodValue[0] === '0' ? moment(now).toDate() : moment(now).subtract(parseInt(periodValue[0]), 'days').endOf('day').toDate()
            };
        }

        DataSource.get(dataSourceId)
            .then(function(dataSource) {
                if (!dataSource) {
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return DataSource.get(dataSourceId);
            }).then(function (dataSource) {
                var query = {
                    data_source_id: dataSourceId
                };

                dimensions.forEach(function (dim) {
                    if (!dim.value || dim.value === 'sum' || dim.value === 'ignore') {
                        return;
                    }

                    dataSource.config.dimensions.some(function (dimension, idx) {
                        if (dimension.key === dim.key) {
                            query['dim' + (idx + 1)] = dim.value;
                            return true;
                        }
                    });
                });

                return Record.find({
                    query: query,
                    count: count,
                    limit: limit,
                    orderBy: orderBy,
                    period: period,
                    distinct: distinct,
                    offset: offset
                });
            }).then(function(records){
                return res.send(records);
            }).catch(next);
    }
);

router.get('/api/multiple_data_sources/:data_infos/records',
    function (req, res, next){
        var dataInfos = JSON.parse(req.param('data_infos') || '[]');
        var periodValue = req.param('period') && req.param('period') !== 'all' ? req.param('period').split(',') : null;
        var period = null;
        var limit = parseInt(req.param('limit') || 0, 10);
        var offset = parseInt(req.param('offset') || 0, 10);
        var sort = req.param('sort') === 'true' || false;
        var exportation = req.param('exportation') || null;
        var operation = req.param('operation') || null;
        var userId = req.user ? req.user.id : null;
        if(dataInfos.length === 0){
            return res.send([]);
        }

        if(periodValue && periodValue.length === 2){
            var now = new Date();
            period = {
                begin: moment(now).subtract(parseInt(periodValue[1]), 'days').startOf('day').toDate(),
                end: periodValue[0] === '0' ? moment(now).toDate() : moment(now).subtract(parseInt(periodValue[0]), 'days').endOf('day').toDate()
            };
        }

        var vertifyPromises = dataInfos.map(function (dataInfo){
            return DataSource.get(dataInfo.id)
                .then(function (dataSource){
                    return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
                });
        });

        //request data
        var requestPromise = blueBird.all(vertifyPromises).then(function (authResults){
            authResults.forEach(function (authResult){
                if(!authResult){
                    return res.send(403);
                }
            });

            operation = operation ? operation : (dataInfos.length > 1 ? 'aggregation' : 'filter');

            if(dataInfos.length === 1) {
                var dataInfo = dataInfos[0];
                var dataSource = null;

                var promise = DataSource.get(dataInfo.id)
                    .then(function (ds) {
                        dataSource = ds;
                        var opts = {};

                        opts.query = {
                            data_source_id: dataSource.id
                        };

                        if(limit){
                            opts.limit = limit;
                        }
                        if(period){
                            opts.period = period;
                        }
                        if(offset){
                            opts.offset = offset;
                        }

                        return Record.find(opts);
                    }).then(function (resp) {
                        var recordLists = process.aggregationAndFilter(resp, dataInfo, operation);

                        return recordLists.map(function (recordList){
                            return {
                                dataSource: dataSource,
                                records: recordList,
                                label: dataSource.name + process.additionalLabel(dataInfo, recordList)
                            };
                        });
                    });

                return promise.then(function(rets){
                    return rets;
                });
            }
            else{
                var promises = dataInfos.map(function (dataInfo) {
                    var ret = {};

                    return DataSource.get(dataInfo.id)
                        .then(function (dataSource) {
                            ret.dataSource = dataSource;
                            var opts = {};

                            opts.query = {
                                data_source_id: dataSource.id
                            };

                            if(limit){
                                opts.limit = limit;
                            }
                            if(period){
                                opts.period = period;
                            }
                            if(offset){
                                opts.offset = offset;
                            }

                            return Record.find(opts);
                        }).then(function (resp) {
                            ret.records = process.aggregationAndFilter(resp, dataInfo, operation);
                            ret.label = ret.dataSource.name + process.additionalLabel(dataInfo, ret.records);

                            return ret;
                        });
                });

                return blueBird.all(promises).then(function (rets){
                    return rets;
                });
            }
        });

        //sort data
        var sortedPromise = requestPromise.then(function (rets){
            if(!sort){
                return rets;
            }

            var sortedMultiRecords = process.sortMultiRecords(
                (function () {
                    return rets.map(function (ret) {
                        return ret.records;
                    });
                }()), {
                    formatTime: process.formatTime,
                    invalidValue: '--'
                }
            );

            var multiRecords = sortedMultiRecords.map(function (sortedRecords, idx){
                return {
                    dataSource: rets[idx].dataSource,
                    records: sortedRecords,
                    label: rets[idx].label
                };
            });

            return multiRecords;
        });

        //export file
        sortedPromise.then(function (rets){
            if(!exportation){
                return res.send(rets);
            }

            if(exportation === 'csv'){
                var separator = ',';
                var lineBreak = '\r\n';

                //file name
                var fileName = process.formatDate(new Date()) + '_';
                fileName += rets.map(function (recordObj){
                    return recordObj.label;
                }).join('-');
                fileName += '.csv';

                //file data
                var tableHead = '\"时间\"' + separator;
                tableHead += rets.map(function (recordObj){
                        return recordObj.dataSource.increment ? '\"' + recordObj.label + '\"' + separator : '\"' + recordObj.label + '\"';
                    }).join(separator);
                tableHead += lineBreak;

                var tableBody = '';
                if(rets && rets !== 0){
                    tableBody = rets[0].records.map(function (record, idx){
                        var row = record.time + separator;

                        row += rets.map(function (recordObj){
                            var value = recordObj.records[idx].value;
                            var diff = '';

                            if(recordObj.dataSource.increment && idx !== recordObj.records.length - 1 &&
                                (recordObj.records[idx] && recordObj.records[idx].value !== '--') &&
                                (recordObj.records[idx + 1] && recordObj.records[idx + 1].value !== '--')){

                                diff = recordObj.records[idx].value - recordObj.records[idx + 1].value;
                            }

                            return recordObj.dataSource.increment ? value + separator + diff : value;
                        }).join(separator);

                        return row;
                    }).join(lineBreak);
                }

                //encode: convert utf-8 to GBK
                var data = tableHead + tableBody;
                var gbkBuffer = iconv.encode(data, 'cp936');
                var encodedFileName = encodeURIComponent(fileName);

                res.setHeader('content-type', 'text/csv');
                res.setHeader('Content-disposition', 'attachment; filename=' + encodedFileName);
                return res.send(gbkBuffer);
            }
            //export json
            else if(exportation === 'table'){
                var content = [];

                var headRow = [];
                headRow.push({
                    value: '时间'
                });
                rets.forEach(function (ret){
                    headRow.push({
                        value: ret.label,
                        increment: ret.dataSource.increment
                    });
                });

                //table head
                content.push(headRow);

                var bodyRows = rets[0].records.map(function (record, idx){
                    var row = [];

                    row.push({
                        value: record.time
                    });

                    rets.forEach(function (ret){
                        row.push({
                            value: ret.records[idx].value
                        });

                        if(!ret.dataSource.increment){
                            return ;
                        }

                        var diff = null;
                        if(idx !== ret.records.length - 1 &&
                            (ret.records[idx] && ret.records[idx].value !== '--') &&
                            (ret.records[idx + 1] && ret.records[idx + 1].value !== '--')){

                            diff = ret.records[idx].value - ret.records[idx + 1].value;
                        }

                        row.push({
                            value: diff,
                            isDiff: true
                        });
                    });

                    return row;
                });

                //table body
                content = content.concat(bodyRows);

                return res.send(content);
            }

        }).catch(next);
    }
);

router.delete(
    '/api/records/:id',
    function(req, res, next) {
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;

        Record.get(id)
            .then(function (record){
                if(!record){
                    return res.send(404);
                }

                return DataSource.get(record.data_source_id);
            }).then(function (dataSource){
                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Record.remove(id);
            }).then(function () {
                return res.send(200);
            }).catch(next);
    }
);

router.delete('/api/projects/:uuid/data_sources/:key',
    function(req, res, next){
        var uuid = req.param('uuid');
        var key = req.param('key');

        var year = req.param('year') ? parseInt(req.param('year'), 10) : null;
        var month = req.param('month') ? parseInt(req.param('month'), 10) : null;
        var day = req.param('day') ? parseInt(req.param('day'), 10) : null;
        var hour = req.param('hour') ? parseInt(req.param('hour'), 10) : null;
        var minute = req.param('minute') ? parseInt(req.param('minute'), 10) : null;
        var second = req.param('second') ? parseInt(req.param('second'), 10) : null;
        year = year > 0 ? year : null;
        month = month > 0 ? month : null;
        day = day > 0 ? day : null;
        hour = hour >= 0 ? hour : null;
        minute = minute >= 0 ? minute : null;
        second = second >= 0 ? second : null;

        var userId = req.user ? req.user.id : null;

        var dataSource = null;
        var dateTime = new Date(year || 0, (month - 1) || 0, day || 0, hour || 0, minute || 0, second || 0);
        var query = {
            date_time: dateTime
        };

        DataSource.getByUUIDAndKey(uuid, key)
            .then(function (obj) {
                if (!obj) {
                    return res.send(404);
                }

                return DataSource.get(obj.id);
            }).then(function (ds){
                dataSource = ds;

                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Record.removeList(dataSource.id, query);
            }).then(function (){
                return res.send(200);
            }).catch(next);
    }
);

router.delete('/api/projects/:uuid/data_sources/:key/records/all',
    function (req, res, next){
        var uuid = req.param('uuid');
        var key = req.param('key');

        var userId = req.user ? req.user.id : null;
        var dataSource = null;

        DataSource.getByUUIDAndKey(uuid, key)
            .then(function (obj) {
                if (!obj) {
                    return res.send(404);
                }

                return DataSource.get(obj.id);
            }).then(function (ds){
                dataSource = ds;

                return apiAuthFilter.vertifyProjectAuthority(userId, dataSource.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Record.removeList(dataSource.id);
            }).then(function (){
                return res.send(200);
            }).catch(next);
    }
);