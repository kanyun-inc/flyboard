'use strict';

var widgets = angular.module('widgets', [
    'ngRoute',
    'services',
    'directives',
    'btford.socket-io'
]);

widgets.factory('Socket', ['socketFactory',
    function (socketFactory){
        return socketFactory();
    }
]);

widgets.service('compareTimes', [function () {
    return function (time1, time2, operator) {
        var d1 = new Date(time1).getTime();
        var d2 = new Date(time2).getTime();

        var ops = operator.split('');
        return ops.some(function (op) {
            if (op === '<') {
                return d1 < d2;
            }
            else if (op === '>') {
                return d1 > d2;
            }
            else if (op === '=') {
                return d1 === d2;
            }

            return false;
        });
    };
}]);

//check if new record match widget dataInfo
widgets.service('isRecordMatchDataInfo', [function () {
    return function (dataInfo, newRecord) {
        //check data_source_id
        if(dataInfo.id !== newRecord.data_source_id){
            return false;
        }

        //check dimensions
        var dimensionConfigs = dataInfo.dimensions;

        var isNotMatch = dimensionConfigs.some(function (dimConfig){
            if(dimConfig.value === 'sum' || dimConfig.value === 'ignore'){
                return false;
            }

            return dimConfig.value !== newRecord[dimConfig.key];
        });

        return !isNotMatch;
    };
}]);

//check if new record match widget series
widgets.service('isRecordMatchSeries', [function () {
    return function (dataInfo, originalRecord, newRecord) {
        var isNotMatch = dataInfo.dimensions.some(function (dim){
            return dim.value === 'ignore' && originalRecord[dim.key] !== newRecord[dim.key];
        });

        return !isNotMatch;
    };
}]);