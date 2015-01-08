'use strict';

//format Date: xxxxxx
exports.formatDate = function(_date) {
    function formatTimeElement(timeElement){
        return (timeElement.toString().length === 1)? '0'+ timeElement: timeElement;
    }

    var date = new Date(_date);
    return '' + date.getFullYear() + formatTimeElement((date.getMonth() + 1)) + formatTimeElement(date.getDate());
};

//format Time: xx年xx月xx日 xx:xx:x
exports.formatTime = function (_date) {
    function formatTimeElement(timeElement){
        return (timeElement.toString().length === 1)? '0'+ timeElement: timeElement;
    }

    var date = new Date(_date);
    return '' + date.getFullYear() + '-' + formatTimeElement(( date.getMonth() + 1 )) + '-' + formatTimeElement(date.getDate()) + '    '+ formatTimeElement(date.getHours()) + ':' + formatTimeElement(date.getMinutes()) + ':' + formatTimeElement(date.getSeconds());
};

/* aggregation and filter */
exports.aggregationAndFilter = function (response, dataInfo, opt) {
    var resp = null;

    if (opt === 'filter') {
        resp = [response];

        if (dataInfo.dimensions && dataInfo.dimensions.length > 0) {
            //VALUE: filter according to dim.value
            dataInfo.dimensions.forEach(function (dimensionObj) {
                if (dimensionObj.value === 'ignore' || dimensionObj.value === 'sum') {
                    return;
                }

                var data = resp[0];
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i][dimensionObj.key] !== dimensionObj.value) {
                        data.splice(i, 1);
                    }
                }
            });

            //IGNORE: split array when dim.value === 'ignore'
            dataInfo.dimensions.forEach(function (dimensionObj) {
                if (dimensionObj.value !== 'ignore') {
                    return;
                }

                var splitedResp = [];
                resp.forEach(function (respItem) {
                    var splitedRespObj = respItem.reduce(function (memo, curr) {
                        if (curr[dimensionObj.key] === null) {
                            return memo;
                        }
                        if (!memo[curr[dimensionObj.key]]) {
                            memo[curr[dimensionObj.key]] = [];
                        }

                        memo[curr[dimensionObj.key]].push(curr);
                        return memo;
                    }, {});

                    Object.keys(splitedRespObj).forEach(function (key){
                        splitedResp.push(splitedRespObj[key]);
                    });
                });

                resp = splitedResp;
            });

            //SUM: aggregation when dim.value === 'sum'
            resp.forEach(function (dataLine) {
                var latestRecordIdx = -1;
                for (var j = dataLine.length - 1; j >= 0; j--) {
                    if(latestRecordIdx !== -1){

                    }
                    if (latestRecordIdx !== -1 && dataLine[latestRecordIdx].date_time.getTime() === dataLine[j].date_time.getTime()) {
                        dataLine[j].value += dataLine[latestRecordIdx].value;
                        dataLine.splice(latestRecordIdx, 1);
                    }

                    latestRecordIdx = j;
                }
            });
        }
    }

    if (opt === 'aggregation') {
        if (!dataInfo.dimensions || dataInfo.dimensions.length === 0) {
            return response;
        }

        resp = response;

        //VALUE: filter according to dim.value
        dataInfo.dimensions.forEach(function (dimension) {
            if (dimension.value !== 'sum') {
                for (var i = resp.length - 1; i >= 0; i--) {
                    if (resp[i][dimension.key] !== dimension.value) {
                        resp.splice(i, 1);
                    }
                }
            }
        });

        //SUM: aggregation when dim.value === 'sum'
        var latestRecordIdx = -1;
        for (var j = resp.length - 1; j >= 0; j--) {
            if (latestRecordIdx !== -1 && resp[latestRecordIdx].date_time.getTime() === resp[j].date_time.getTime()) {
                resp[j].value += resp[latestRecordIdx].value;
                resp.splice(latestRecordIdx, 1);
            }

            latestRecordIdx = j;
        }
    }

    return resp;
};

/* sort multiRecords -- record order : newest record first
 *  opts: {
 *      formatTime: func,
 *      invalidValue: '--'
 *  }
 */

exports.sortMultiRecords = function (multiRecords, opts) {
    var sortedMultiRecords = [];
    var stopFlag = false;
    var pointers = [];

    multiRecords.forEach(function (records, idx) {
        pointers[idx] = 0;
        sortedMultiRecords[idx] = [];
    });

    /*jshint loopfunc:true*/
    while (!stopFlag) {
        var max = null;
        var newRecords = [];

        multiRecords.forEach(function (records, idx) {
            var pointer = pointers[idx];

            if (pointer >= records.length) {
                return;
            }

            var time = new Date(records[pointer].date_time).getTime();

            if (max === null || max < time) {
                max = time;
                newRecords = [idx];
            }
            else if (max === time) {
                newRecords.push(idx);
            }
        });

        if (max === null) {
            stopFlag = true;
            continue;
        }

        multiRecords.forEach(function (records, idx) {
            if (newRecords.indexOf(idx) === -1) {
                sortedMultiRecords[idx].push({
                    time: (opts && opts.formatTime) ? opts.formatTime(max) : max,
                    date_time: new Date(max),
                    value: (opts && opts.invalidValue)? opts.invalidValue : 0
                });
            }
            else {
                sortedMultiRecords[idx].push({
                    time: (opts && opts.formatTime) ? opts.formatTime(max) : max,
                    date_time: new Date(max),
                    value: records[pointers[idx]].value
                });

                pointers[idx] = pointers[idx] + 1;
            }
        });
    }

    return sortedMultiRecords;
};

/** label: dataSource.name + dimensions' name */
exports.additionalLabel = function (dataInfo, records) {
    if (!dataInfo.dimensions || dataInfo.dimensions.length === 0 || !records || records.length === 0) {
        return '';
    }

    var dimensionNameCombineStr = dataInfo.dimensions.map(function (dimension) {
        if (dimension.value === 'sum') {
            return null;
        }

        var value = dimension.value === 'ignore' ? records[0][dimension.key] : dimension.value;
        return dimension.name + '(' + value + ')';

    }).filter(function (item) {
        return item !== null;
    }).join('｜');

    return dimensionNameCombineStr.length > 0 ? '-' + dimensionNameCombineStr : dimensionNameCombineStr;
}