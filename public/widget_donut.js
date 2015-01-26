'use strict';

var widgets = angular.module('widgets');

widgets.directive('widgetDonut', [
    'widgetUrl',
    'Record',
    '$timeout',
    'Message',
    'RecordMultiple',
    'Socket',
    'compareTimes',
    'isRecordMatchDataInfo',
    function (
        widgetUrl,
        Record,
        $timeout,
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
            templateUrl: 'public/src/include/widgets/donut.html',
            replace: true,
            link: function ($scope, $elem) {
                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var $this = this;
                var $container = $elem.find('.cf-svp');
                var $metrics = $container.find('.metrics span');
                var $arrow = $elem.find('.change .arrow');
                var $changeMetric = $elem.find('div.change');
                var $changeMetricContent = $changeMetric.find('.change-content');
                var $large = $changeMetric.find('.large');
                var $small = $changeMetric.find('.small');
                var config = $scope.widget.config;
                $container.data('id', 'widget-' + $scope.widget.id);

                var backupResp = [];
                var chartWrapper = rSVP($container);
                //broadcast to call fitText once
                $scope.$broadcast('fitdonut');

                /************************** event handle function ******************************/

                function updateChangeContentLocation(){
                    $changeMetricContent.css('margin-left', ($changeMetric.width() - $changeMetricContent.width()) / 2);
                }

                function updateWidgetValue (resp){
                    var $container = $(this).find('.cf-svp');

                    resp = (!resp || resp.length === 0) ? [
                        {value: null}
                    ] : resp;

                    backupResp = resp;
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
                        $changeMetric.removeClass('m-green');
                        $changeMetric.addClass('m-red');
                    }
                    else {
                        $arrow.removeClass('glyphicon-arrow-up');
                        $arrow.addClass('glyphicon-arrow-down');
                        $changeMetric.removeClass('m-red');
                        $changeMetric.addClass('m-green');
                    }

                    //update change metric value
                    det = Math.abs(det).toFixed(2).toString().split('.');
                    $large.text(det[0]);
                    $small.text('.' + det[1] + '%');
                    //update content location
                    updateChangeContentLocation();

                    //update current value
                    var chart = chartWrapper.chart;
                    if (resp[0].value === null) {
                        $metrics.css('display', 'none');
                    }
                    else {
                        config.value = resp[0].value + '';
                        $metrics.css('display', '');
                    }

                    // Call EasyPieChart update function
                    chart.update(config.value);
                    // Update the data-percent so it redraws on resize properly
                    $container.find('.chart').data('percent', config.value);
                    // Update the UI metric
                    $elem.find('.metric span').html(numeral(config.value).format('0,0.[00]'));

                    //timestamp
                    if(resp && resp.length){
                        $scope.updatedTime = formatTime(new Date(resp[0].date_time));
                    }

                    //call fitText
                    $scope.$broadcast('fitdonut');
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

                    }).catch(function (errorType) {
                        if (errorType.status === 404) {
                            Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                        }
                    });
                }

                /************************** call reload ******************************/

                reload.apply($this);

                /************************** event handle function ******************************/

                function resizeWidget(evt, data) {
                    if (data && data.id === $scope.widget.id) {
                        chartWrapper.generateChart();
                    }
                }

                function updateWidget(evt, data) {
                    if (data && data.id === $scope.widget.id) {
                        reload.apply($this);
                        chartWrapper.generateChart();
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

                                // if save old record: not handle
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
                                // update widget
                                updateWidgetValue(backupResp);

                                return true;
                            }
                        }

                        return false;
                    });
                }

                /************************** bind event handler ******************************/

                $(window).on('resize', updateChangeContentLocation);

                var cleanUpFuncs = [];
                cleanUpFuncs.push($scope.$on('widgetlayoutchange', resizeWidget));
                cleanUpFuncs.push($scope.$on('widgetupdate', updateWidget));

                //auto update
                Socket.on('recordUpdate', recordUpdateHandle);

                /************************** unbind event handler ******************************/

                $scope.$on('$destroy', function () {
                    $timeout(function () {
                        if (chartWrapper) {
                            chartWrapper.destroy();
                        }
                    }, 5000);

                    $(window).off('resize', updateChangeContentLocation);

                    cleanUpFuncs.forEach(function (cleanUpFunc) {
                        cleanUpFunc();
                    });

                    Socket.disconnect();
                });
            }
        };
    }
]);