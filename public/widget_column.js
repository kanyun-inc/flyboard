'use strict';

var widgets = angular.module('widgets');

widgets.directive('widgetColumn', [
    'widgetUrl',
    '$q',
    'DataSource',
    'Record',
    '$timeout',
    'Message',
    'RecordMultiple',
    'Socket',
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
        isRecordMatchDataInfo,
        isRecordMatchSeries) {
        return {
            restrict: 'A',
            scope: {
                widget: '=widget',
                widgets: '=',
                dashboard: '=ds'
            },
            templateUrl: 'public/src/include/widgets/column.html',
            replace: true,
            link: function ($scope, $elem) {
                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var config = $scope.widget.config;
                var $container = $($elem).find('.content');
                var timeLine = [];
                config.dataInfos = config.dataInfos || [];
                var backupDataSeries = [];

                /************************** data request of widget ******************************/

                function requestData (config){
                    return RecordMultiple.query({
                        data_infos: JSON.stringify(config.dataInfos),
                        sort: true,
                        limit: config.limit || 0
                    }).$promise.then(function (rets){
                        return rets;
                    });
                }

                function request() {
                    return requestData(config);
                }

                /************************** draw chart ******************************/

                function reload() {

                    var promise = request();

                    promise.then(function (formatedRespObjs) {
                        //data series
                        var dataSeries = formatedRespObjs.map(function (formatedRespObj, idx) {
                            return {
                                name: formatedRespObj.label,
                                color: defaultColors[(idx >= defaultColors.length ? (idx % defaultColors.length) : idx)],
                                data: formatedRespObj.records.map(
                                    function (record) {
                                        return record.value;
                                    }),
                                records: formatedRespObj.records,
                                dataInfo: formatedRespObj.dataInfo
                            };
                        });

                        dataSeries.forEach(function (seriesObj) {
                            seriesObj.data.reverse();
                        });

                        backupDataSeries = angular.copy(dataSeries);

                        //timeline
                        if(formatedRespObjs && formatedRespObjs.length > 0 && formatedRespObjs[0].records && formatedRespObjs[0].records.length > 0) {
                            timeLine = formatedRespObjs[0].records.map(function (record) {
                                return record.time;
                            });
                        }

                        timeLine.reverse();

                        //update data
                        chart.xAxis[0].setCategories(timeLine);

                        if(chart.series && chart.series.length > 0){
                            for (var idx = chart.series.length - 1; idx >= 0; idx--) {
                                chart.series[idx].remove(true);
                            }
                        }

                        chart.series = [];
                        dataSeries.forEach(function (seriesObj) {
                            chart.addSeries(seriesObj);
                        });
                        chart.yAxis[0].update({
                            gridLineWidth: 1
                        });

                        chart.redraw();

                        //timestamp
                        if(timeLine && timeLine.length){
                            $scope.updatedTime = formatTime(new Date(timeLine[timeLine.length - 1]));
                        }
                    }).catch(function (errorType) {
                        if (errorType.status === 404) {
                            Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                        }
                    });
                }

                //redraw the chart
                function redraw() {
                    var chart = this;

                    chart.redraw();

                    //timestamp
                    if(timeLine && timeLine.length){
                        $scope.updatedTime = formatTime(new Date(timeLine[timeLine.length - 1]));
                    }
                }

                //draw chart
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: $container.get(0),
                        type: 'column',
                        backgroundColor: '#3b3b3b',
                        marginRight: 20,
                        marginTop: 30,
                        events: {
                            load: function () {
                                reload.apply(this);
                            }
                        }
                    },
                    title: {
                        text: null
                    },
                    legend: {
                        itemStyle: {
                            color: 'lightgrey'
                        }
                    },
                    xAxis: {
                        categories: [],
                        lineColor: 'rgb(169,169,169)'
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        gridLineColor: 'rgb(169, 169, 169)',
                        gridLineWidth: 0
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:12px">{point.key}</span><table>',
                        pointFormat: '<tr style="font-size: 10px"><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding: 0; color: #000000"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: []
                });

                function resizeWidget(evt, data) {
                    if (data && data.id === $scope.widget.id) {
                        chart.reflow();
                    }
                }

                function updateWidget(evt, data) {
                    if (data && data.id === $scope.widget.id) {
                        reload.apply(chart);
                    }
                }

                function recordToPoint (record){
                    return {
                        x: new Date(record.date_time).getTime(),
                        y: record.value
                    };
                }

                function findPosition (newPoint, timeLine){
                    var index = -1;

                    timeLine.some(function (timePoint, idx){
                        if(newPoint.x <= new Date(timePoint).getTime()){
                            index = idx;
                            return true;
                        }
                    });

                    return index;
                }

                function recordUpdateHandle (params) {
                    var isReload = false;
                    var isRefresh = false;

                    var isDataInfoMatch = false;
                    var isTimeMatch = false;
                    var isSeriesMatch = false;

                    config.dataInfos.forEach(function (dataInfo, indexs) {
                        if(chart.series.length === 0){
                            isReload = true;
                            return ;
                        }

                        chart.series.forEach(function (seriesObj, idx) {
                            var backupDataSeriesObj = backupDataSeries[idx];
                            var record = backupDataSeriesObj.records && backupDataSeriesObj.records[0] ? backupDataSeriesObj.records[0] : {};
                            var newPoint = null;
                            var index = -1;
                            var y = 0;

                            //series not related to the dataInfo
                            if(!deepCompare(backupDataSeriesObj.dataInfo, dataInfo)){
                                return ;
                            }

                            if (params.operation === 'save') {

                                if (!isRecordMatchDataInfo(dataInfo, params.record)) {
                                    return;
                                }

                                isDataInfoMatch = true;

                                newPoint = recordToPoint(params.record);
                                index = findPosition(newPoint, timeLine);

                                // save old record: not handle
                                if (index === 0 && newPoint.x !== new Date(timeLine[index]).getTime() && seriesObj.data.length === config.limit) {
                                    return;
                                }

                                isTimeMatch = true;

                                if(!isRecordMatchSeries(dataInfo, record, params.record)){
                                    return ;
                                }

                                isSeriesMatch = true;

                                // should add a new point at last
                                if (index === -1) {
                                    var shift = seriesObj.data.length === config.limit;
                                    var newTime = formatTime(new Date(newPoint.x));

                                    seriesObj.addPoint(newPoint.y, false, shift);

                                    chart.series.forEach(function (series) {
                                        if (seriesObj === series) {
                                            return false;
                                        }

                                        series.addPoint(0, false, shift);
                                    });

                                    timeLine.push(newTime);

                                    if(shift){
                                        timeLine.splice(0, 1);
                                    }

                                    chart.xAxis[0].setCategories(timeLine);

                                    isRefresh = true;
                                }
                                // should update point series.data[index]
                                else if(newPoint.x === new Date(timeLine[index]).getTime()){
                                    y = seriesObj.data[index].y + params.record.value;
                                    seriesObj.data[index].update(y);

                                    isRefresh = true;
                                }
                                else{
                                    isReload = true;
                                }
                            }

                            if (params.operation === 'update') {
                                if (!isRecordMatchDataInfo(dataInfo, params.record)) {
                                    return;
                                }

                                newPoint = recordToPoint(params.record);
                                index = findPosition(newPoint, timeLine);

                                if (index === -1 || newPoint.x !== new Date(timeLine[index]).getTime()) {
                                    return;
                                }

                                if(!isRecordMatchSeries(dataInfo, record, params.record)){
                                    return ;
                                }

                                y = seriesObj.data[index].y + params.record.value - params.oldRecord.value;
                                seriesObj.data[index].update(y);

                                isRefresh = true;
                            }

                            if (params.operation === 'remove') {
                                if (!isRecordMatchDataInfo(dataInfo, params.record)) {
                                    return;
                                }

                                newPoint = recordToPoint(params.record);
                                index = findPosition(newPoint, timeLine);

                                if (index === -1 || newPoint.x !== new Date(timeLine[index]).getTime()) {
                                    return;
                                }

                                if(!isRecordMatchSeries(dataInfo, record, params.record)){
                                    return ;
                                }

                                isReload = true;
                            }

                            if (params.operation === 'remove list') {
                                params.records.some(function (rec) {
                                    if (!isRecordMatchDataInfo(dataInfo, rec)) {
                                        return;
                                    }

                                    newPoint = recordToPoint(rec);
                                    index = findPosition(newPoint, timeLine);

                                    if (index === -1 || newPoint.x !== new Date(timeLine[index]).getTime()) {
                                        return false;
                                    }

                                    if(!isRecordMatchSeries(dataInfo, record, rec)){
                                        return false;
                                    }

                                    isReload = true;
                                    return true;
                                });
                            }

                        });

                    });

                    if(params.operation === 'save' && isDataInfoMatch && isTimeMatch && !isSeriesMatch){
                        isReload = true;
                    }

                    //handle
                    if(isReload){
                        reload.apply(chart);
                    }

                    if(isRefresh){
                        redraw.apply(chart);
                    }
                }


                /************************** bind event handler ******************************/

                var cleanUpFuncs = [];
                cleanUpFuncs.push($scope.$on('widgetlayoutchange', resizeWidget));
                cleanUpFuncs.push($scope.$on('widgetupdate', updateWidget));

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
            }
        };
    }
]);