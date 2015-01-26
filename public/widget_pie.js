'use strict';

var widgets = angular.module('widgets');

widgets.directive('widgetPie', [
    'widgetUrl',
    '$q',
    'DataSource',
    'Record',
    '$timeout',
    'Message',
    'RecordMultiple',
    'Socket',
    'compareTimes',
    'isRecordMatchDataInfo',
    'isRecordMatchSeries',
    function (
        widgetUrl,
        $q,
        DataSource,
        Record,
        $timeout,
        Message,
        RecordMultiple,
        Socket,
        compareTimes,
        isRecordMatchDataInfo,
        isRecordMatchSeries
        ) {
        return {
            restrict: 'A',
            scope: {
                widget: '=widget',
                widgets: '=',
                dashboard: '=ds'
            },
            templateUrl: 'public/src/include/widgets/pie.html',
            replace: true,
            link: function ($scope, $elem) {
                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var $container = $($elem).find('.cf-pie');
                var pId = $container.prop('id');
                var config = $scope.widget.config;
                config.dataInfos = config.dataInfos || [];
                var backupDataSeries = [];

                // Store chart information
                cf_rPs[pId] = {};

                //request data
                function requestData (config){
                    return RecordMultiple.query({
                        data_infos: JSON.stringify(config.dataInfos),
                        limit: 1
                    }).$promise.then(function (rets){
                        return rets;
                    });
                }
                function request() {
                    var dataPromise = requestData(config);

                    backupDataSeries = [];

                    return dataPromise.then(function (formatedRespObjs){
                        return formatedRespObjs.map(function (formatedRespObj, idx){
                            var dataInfo = config.dataInfos.length === 1 ? config.dataInfos[0] : config.dataInfos[idx];

                            backupDataSeries.push({
                                label: formatedRespObj.dataSource.name + additionalLabel(dataInfo, formatedRespObj.records),
                                dataInfo: dataInfo,
                                record: formatedRespObj.records[0],
                                dataSource: formatedRespObj.dataSource
                            });

                            if ((formatedRespObj.records ? formatedRespObj.records.length : 0) === 0) {
                                return [formatedRespObj.dataSource.name, 0, null];
                            }

                            return [
                                    formatedRespObj.dataSource.name + additionalLabel(dataInfo, formatedRespObj.records),
                                    formatedRespObj.records[0].value,
                                    formatedRespObj.records[0].date_time
                            ];

                        });
                    });
                }

                //request data
                var promises = request();

                //draw chart
                $q.all(promises).then(function (data) {
                    if (isScopeDestroyed($scope)) {
                        return;
                    }

                    //timestamp
                    if(data && data.length && data[0][2]){
                        $scope.updatedTime = formatTime(new Date(data[0][2]));
                    }

                    function reload() {
                        var promises = request();

                        $q.all(promises).then(function (data) {

                            //timestamp
                            if(data && data.length && data[0][2]){
                                $scope.updatedTime = formatTime(new Date(data[0][2]));
                            }

                            chart.series[0].setData(data);
                            chart.redraw();
                        }).catch(function (errorType) {
                            if (errorType.status === 404) {
                                Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                            }
                        });
                    }

                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: $container.get(0),
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            backgroundColor: 'rgba(0,0,0,0)',
                            events: {}
                        },
                        title: {
                            text: ''
                        },
                        tooptip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                size: null,
                                center: [null, null],
                                allowPointSelect: true,
                                cursor: 'pointer',
                                colors: defaultColors,
                                dataLabels: {
                                    enabled: true,
                                    formatter: function () {
                                        var lineWidth = Math.round($container.width() / 3);
                                        var string = [].slice.call(this.point.name);
                                        var numberPerLine = Math.round(lineWidth / 14);
                                        var count = 0;

                                        for (var i = 1; i < string.length; i++) {
                                            if ((i - count) % numberPerLine === 0) {
                                                string.splice(i, 0, '<br>');
                                                count += 1;
                                                i += 1;
                                            }
                                        }

                                        return '<b>' + string.join('') + '</b>:' + this.point.percentage.toFixed(1) + '%';
                                    },
                                    color: 'lightgray',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                        fontSize: '14px',
                                        width: Math.round($container.width() / 5) + 'px'
                                    }
                                }
                            }
                        },
                        series: [
                            {
                                type: 'pie',
                                name: config.name,
                                data: data
                            }
                        ]
                    });

                    /************************** event handle function ******************************/

                    function resizeWidget(evt, data) {
                        if (data && data.id === $scope.widget.id) {
                            chart.reflow();
                        }
                    }

                    function updateWidget(evt, data) {
                        if (data && data.id === $scope.widget.id) {
                            //reload
                            reload.apply(chart);
                        }
                    }

                    function recordUpdateHandle(params){
                        var chartData = chart.series[0].data;

                        var isRefresh = false;
                        var isReload = false;

                        var isDataInfoMatch = false;
                        var isTimeMatch = false;
                        var isSeriesMatch = false;

                        if(!data || data.length === 0){
                            return ;
                        }

                        //check each dataInfo
                        config.dataInfos.forEach(function (dataInfo){

                            //check each series of the dataInfo
                            chartData.forEach(function (seriesInfos, idx) {
                                //series not related to the dataInfo
                                if (dataInfo !== backupDataSeries[idx].dataInfo) {
                                    return ;
                                }

                                var record = backupDataSeries[idx].record;

                                //handle different operation
                                if (params.operation === 'save') {

                                    if(!isRecordMatchDataInfo(dataInfo, params.record)){
                                        return ;
                                    }

                                    isDataInfoMatch = true;

                                    // seriesInfos[2]: record date_time
                                    // save old record: not handle
                                    if (record && !compareTimes(params.record.date_time, record.date_time, '>=')) {
                                        return;
                                    }

                                    isTimeMatch = true;

                                    if(!isRecordMatchSeries(dataInfo, record, params.record)){
                                        return ;
                                    }

                                    isSeriesMatch = true;

                                    // saved record will affect widget value: reload
                                    isReload = true;
                                }

                                if (params.operation === 'update') {
                                    if(!isRecordMatchDataInfo(dataInfo, params.record)){
                                        return ;
                                    }

                                    // if update old record: not handle
                                    if (record && !compareTimes(params.record.date_time, record.date_time, '=')) {
                                        return;
                                    }

                                    if(!isRecordMatchSeries(dataInfo, record, params.record)){
                                        return ;
                                    }

                                    // updatedrecord will affect widget value: refresh
                                    var newDateArray = chartData.map(function (seriesInfos, index){
                                        if(index !== idx){
                                            return [
                                                backupDataSeries[index].label,
                                                seriesInfos.y
                                            ];
                                        }

                                        return [
                                            backupDataSeries[index].label,
                                            seriesInfos.y + params.record.value - params.oldRecord.value
                                        ];
                                    });

                                    chart.series[0].setData(newDateArray);
                                    isRefresh = true;
                                }

                                if (params.operation === 'remove') {
                                    if(!isRecordMatchDataInfo(dataInfo, params.record)){
                                        return ;
                                    }

                                    // if delete old record: not handle
                                    if (record && !compareTimes(params.record.date_time, record.date_time, '=')) {
                                        return;
                                    }

                                    if(!isRecordMatchSeries(dataInfo, record, params.record)){
                                        return ;
                                    }

                                    // deleted record will affect widget value: reload
                                    isReload = true;

                                }

                                if (params.operation === 'remove list') {

                                    isReload = params.records.some(function (rec) {
                                        if(!isRecordMatchDataInfo(dataInfo, rec)){
                                            return ;
                                        }

                                        // if delete old recorordd: not handle
                                        if(record && !compareTimes(rec.date_time, record.date_time, '=')) {
                                            return false;
                                        }

                                        if(!isRecordMatchSeries(dataInfo, record, rec)){
                                            return false;
                                        }

                                        // deleted record will affect widget value: reload
                                        return true;
                                    });
                                }

                            });

                        });

                        // a new series should be added: reload
                        if(params.operation === 'save' && isDataInfoMatch && isTimeMatch && !isSeriesMatch){
                            isReload = true;
                        }

                        if(isReload){
                            reload.apply(chart);
                            return true;
                        }

                        if(isRefresh){
                            chart.reflow();
                            return true;
                        }
                    }

                    /************************** bind event handler ******************************/

                    var cleanUpFuncs = [];
                    cleanUpFuncs.push($scope.$on('widgetlayoutchange', resizeWidget));
                    cleanUpFuncs.push($scope.$on('widgetupdate', updateWidget));

                    //auto update
                    Socket.on('recordUpdate', recordUpdateHandle);

                    /************************** unbind event handler ******************************/

                    $scope.$on('$destroy', function () {
                        $timeout(function () {
                            if (chart) {
                                chart.destroy();
                            }
                        }, 5000);

                        cleanUpFuncs.forEach(function (cleanUpFunc) {
                            cleanUpFunc();
                        });

                        Socket.disconnect();
                    });
                }).catch(function (errorType) {
                    if (errorType.status === 404) {
                        Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                    }
                });
            }
        };
    }
]);
