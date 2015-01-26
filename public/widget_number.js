'use strict';

var widgets = angular.module('widgets');

widgets.directive('widgetNumber', [
    'widgetUrl',
    '$q',
    'Record',
    'Message',
    'RecordMultiple',
    'Socket',
    'compareTimes',
    'isRecordMatchDataInfo',
    function (
        widgetUrl,
        $q,
        Record,
        Message,
        RecordMultiple,
        Socket,
        compareTimes,
        isRecordMatchDataInfo
        ) {
        return {
            restrict: 'A',
            scope: {
                widget: '=widget',
                dashboard: '=ds'
            },
            templateUrl: 'public/src/include/widgets/number.html',
            replace: true,
            link: function ($scope, $elem) {
                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var $this = this;
                var $widget = $($elem);
                var $metric = $widget.find('.metric span');
                var $metricSmall = $widget.find('.metric-small');
                var $change = $widget.find('.change');
                var $arrow = $widget.find('.arrow');
                var $large = $widget.find('.large');
                var $small = $widget.find('.small');
                var config = $scope.widget.config;

                var backupResp = [];

                /************************** event handle function ******************************/

                // No custom options
                function updateWidgetValue(resp){
                    resp = (!resp || resp.length === 0) ? [
                        {value: null}
                    ] : resp;

                    backupResp = angular.copy(resp);
                    var det = null;

                    if (!resp || resp.length !== 2 || ( resp.length === 2 && resp[1].value === 0 )) {
                        det = 0;
                    }
                    else {
                        det = ((resp[0].value - resp[1].value) / Math.abs(resp[1].value)) * 100;
                    }

                    if (det > 0) {
                        $arrow.removeClass('glyphicon-arrow-down');
                        $arrow.addClass('glyphicon-arrow-up');
                        $metricSmall.removeClass('m-green');
                        $metricSmall.addClass('m-red');
                    }
                    else {
                        $arrow.removeClass('glyphicon-arrow-up');
                        $arrow.addClass('glyphicon-arrow-down');
                        $metricSmall.removeClass('m-red');
                        $metricSmall.addClass('m-green');
                    }

                    $metric.html(numeral(resp[0].value).format('0,0.[00]'));
                    if (resp[0].value === null) {
                        $change.css('display', 'none');
                    } else {
                        $change.css('display', '');
                    }

                    det = Math.abs(det).toFixed(2).toString().split('.');
                    $large.text(det[0]);
                    $small.text('.' + det[1] + '%');

                    //timestamp
                    if(resp && resp.length){
                        $scope.updatedTime = formatTime(new Date(resp[0].date_time));
                    }

                    //call fitText
                    $scope.$broadcast('fitnumber');
                }

                function reload() {
                    //request data
                    function requestData (config){
                        return RecordMultiple.query({
                            data_infos: JSON.stringify(config.dataInfos),
                            limit: 2,
                            operation: 'aggregation'
                        }).$promise.then(function (rets){
                            return rets;
                        });
                    }
                    function request() {
                        var dataPromise = requestData(config);

                        return dataPromise.then(function (rets){
                            return rets.map(function (ret){
                                return ret.records;
                            });
                        });
                    }

                    var promise = request();

                    promise.then(function (resp) {

                        //update change percentage
                        updateWidgetValue(resp);

                    }, 'json').catch(function (errorType) {
                        if (errorType.status === 404) {
                            Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                        }
                    });
                }

                /************************** call reload ******************************/

                reload.apply($this);

                /************************** event handle function ******************************/

                function updateWidget(evt, data) {
                    if (data && data.id === $scope.widget.id) {
                        reload.apply($this);
                    }
                }

                function recordUpdateHandle (params){

                    config.dataInfos.forEach(function (dataInfo){
                        if(dataInfo.id === params.dataSource.id){
                            var isReload = false;
                            var isRefresh = false;

                            //handle different operation
                            if(params.operation === 'save'){
                                if(!isRecordMatchDataInfo(dataInfo, params.record)){
                                    return ;
                                }

                                // save old record: not handle
                                var time = backupResp.length > 1 ? backupResp[1].date_time : backupResp[0].date_time;
                                if(compareTimes(time, params.record.date_time, '>')){
                                    return false;
                                }

                                // if saved record will affect widget value: reload
                                isReload = true;
                            }

                            if(params.operation === 'update'){
                                if(!isRecordMatchDataInfo(dataInfo, params.record)){
                                    return ;
                                }

                                // if update old record: not handle
                                if(!compareTimes(backupResp[0].date_time, params.record.date_time, '=') &&
                                    (backupResp.length === 1 || backupResp.length > 1 && !compareTimes(backupResp[1].date_time, params.record.date_time, '=') )){
                                    return false;
                                }

                                // if updatedrecord will affect widget value: refresh
                                if(compareTimes(backupResp[0].date_time, params.record.date_time, '=')){
                                    backupResp[0].value += params.record.value - params.oldRecord.value;
                                }
                                else{
                                    backupResp[1].value += params.record.value - params.oldRecord.value;
                                }

                                isRefresh = true;
                            }

                            if(params.operation === 'remove'){
                                if(!isRecordMatchDataInfo(dataInfo, params.record)){
                                    return ;
                                }

                                // if delete old record: not handle
                                if(!compareTimes(backupResp[0].date_time, params.record.date_time, '=') &&
                                    (backupResp.length === 1 || backupResp.length > 1 && !compareTimes(backupResp[1].date_time, params.record.date_time, '=') )){
                                    return false;
                                }

                                // if deleted record will affect widget value: reload
                                isReload = true;
                            }

                            if(params.operation === 'remove list'){

                                isReload = params.records.some(function (record){
                                    if(!isRecordMatchDataInfo(dataInfo, record)){
                                        return ;
                                    }

                                    // if delete old record: not handle
                                    if(!compareTimes(backupResp[0].date_time, record.date_time, '=') &&
                                        (backupResp.length === 1 || backupResp.length > 1 && !compareTimes(backupResp[1].date_time, record.date_time, '=') )){
                                        return false;
                                    }

                                    // if deleted record will affect widget value: reload
                                    return true;
                                });
                            }

                            if(isReload){
                                reload.apply($this);
                                return true;
                            }

                            if(isRefresh){
                                //update widget value
                                updateWidgetValue(backupResp);

                                return true;
                            }
                        }

                        return false;
                    });
                }

                /************************** bind event handler ******************************/

                var cleanUpFuncs = [];

                cleanUpFuncs.push($scope.$on('widgetupdate', updateWidget));

                //auto update
                Socket.on('recordUpdate', recordUpdateHandle);

                /************************** unbind event handler ******************************/
                $scope.$on('$destroy', function () {
                    cleanUpFuncs.forEach(function (cleanUpFunc) {
                        cleanUpFunc();
                    });

                    Socket.disconnect();
                });
            }
        };
    }
]);