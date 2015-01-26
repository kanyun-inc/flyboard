'use strict';

var widgets = angular.module('widgets');


widgets.directive('widgetSpline', [
    '$q',
    'DataSource',
    'Record',
    '$timeout',
    'widgetUrl',
    'Message',
    'RecordMultiple',
    'Socket',
    'isRecordMatchDataInfo',
    'isRecordMatchSeries',
    function (
        $q,
        DataSource,
        Record,
        $timeout,
        widgetUrl,
        Message,
        RecordMultiple,
        Socket,
        isRecordMatchDataInfo,
        isRecordMatchSeries) {
        return {
            restirct: 'A',
            scope: {
                widget: '=widget',
                dashboard: '=ds'
            },
            templateUrl: 'public/src/include/widgets/spline.html',
            replace: true,
            link: function ($scope, $elem) {

                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var config = $scope.widget.config;
                var $container = $($elem).find('.content');
                config.dataInfos = config.dataInfos || [];
                var backupDataSeries = [];

                /************************** data request of widget ******************************/

                function requestData (config){
                    return RecordMultiple.query({
                        data_infos: JSON.stringify(config.dataInfos),
                        limit: config.limit || 0
                    }).$promise.then(function (rets){
                        return rets;
                    });
                }

                function request() {
                    var dataPromise = requestData(config);

                    return dataPromise.then(function (formatedRespObjs){
                        return formatedRespObjs.map(function (formatedRespObj, idx){
                            var lineOpt = {};
                            var dataInfo = config.dataInfos.length === 1 ? config.dataInfos[0] : config.dataInfos[idx];
                            lineOpt.name = formatedRespObj.dataSource.name + additionalLabel(dataInfo, formatedRespObj.records);
                            idx = idx >= defaultColors.length ? (idx % defaultColors.length) : idx;
                            lineOpt.color = defaultColors[idx];
                            lineOpt.data = [];
                            lineOpt.dataInfo = dataInfo;

                            formatedRespObj.records.reverse().forEach(function (record) {
                                lineOpt.data.push({
                                    x: getTimeFromRecord(record),
                                    y: record.value
                                });
                            });

                            lineOpt.records = angular.copy(formatedRespObj.records);

                            return lineOpt;
                        });
                    });
                }

                /************************** draw chart ******************************/

                var promises = request();

                $q.all(promises).then(function (dataSeries) {
                    if (isScopeDestroyed($scope)) {
                        return;
                    }

                    /************************** event handle function ******************************/

                    //redraw widget
                    function redraw(){
                        var chart = this;

                        chart.redraw();
                    }

                    //reload the chart
                    function reload() {
                        var chart = this;

                        var promises = request();
                        $q.all(promises).then(function (dataSeries) {

                            backupDataSeries = dataSeries;

                            //timestamp
                            if(dataSeries && dataSeries.length && dataSeries[0].data && dataSeries[0].data.length){
                                var timeStamp = new Date(dataSeries[0].data[dataSeries[0].data.length - 1].x);
                                $scope.updatedTime = formatTime(timeStamp);
                            }

                            for (var idx = chart.series.length - 1; idx >= 0; idx--) {
                                chart.series[idx].remove(true);
                            }

                            dataSeries.forEach(function (seriesObj) {
                                chart.addSeries(seriesObj);
                            });

                            redraw.apply(chart);
                        }).catch(function (errorType) {

                        });
                    }

                    /************************** draw chart ******************************/

                    backupDataSeries = dataSeries;

                    //timestamp
                    if(dataSeries && dataSeries.length && dataSeries[0].data && dataSeries[0].data.length){
                        var timeStamp = new Date(dataSeries[0].data[dataSeries[0].data.length - 1].x);
                        $scope.updatedTime = formatTime(timeStamp);
                    }

                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: $container.get(0),
                            backgroundColor: '#3b3b3b',
                            type: 'spline',
                            animation: Highcharts.svg, // don't animate in old IE
                            marginRight: 15,
                            marginTop: 10,
                            events: {}
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval: 150,
                            lineColor: 'rgb(169, 169, 169)'
                        },
                        yAxis: {
                            title: null,
                            gridLineColor: null,
                            plotLines: null,
                            min: ( config.minThreshold !== undefined && config.minThreshold >= 0 ) ? config.minThreshold : null,
                            max: ( config.maxThreshold !== undefined && config.maxThreshold >= 0 ) ? config.maxThreshold : null,
                            startOnTick: false,
                            endOnTick: false
                        },
                        tooltip: {
                            crosshairs: true,
                            shared: true
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'left',
                            verticalAlign: 'top',
                            y: 0,
                            floating: true,
                            borderWidth: 0,
                            itemStyle: {
                                color: 'lightgray'
                            }
                        },
                        exporting: {
                            enabled: false
                        },
                        series: dataSeries,
                        plotOptions: {
                            spline: {
                                colors: defaultColors,
                                dataLabels: {
                                    enabled: true,
                                    color: 'lightgray',
                                    formatter: function () {
                                        if (this.point.x === this.series.data[this.series.data.length - 1].x) {
                                            return this.y;
                                        } else {
                                            return null;
                                        }
                                    }
                                }
                            }
                        }
                    });

                    /************************** event handle function ******************************/

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

                    function findPosition (newPoint, pointArray){
                        var index = -1;

                        pointArray.some(function (point, idx){
                            if(newPoint.x <= point.x){
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

                        config.dataInfos.forEach(function (dataInfo){
                            if(chart.series.length === 0){
                                isReload = true;
                                return ;
                            }

                            //check each series of the dataInfo
                            chart.series.forEach(function (seriesObj, idx) {
                                var backupDataSeriesObj = backupDataSeries[idx];
                                var record = backupDataSeriesObj.records && backupDataSeriesObj.records[0] ? backupDataSeriesObj.records[0] : {};
                                var newPoint = null;
                                var index = -1;
                                var y = 0;

                                //series not related to the dataInfo
                                if(backupDataSeriesObj.dataInfo !== dataInfo){
                                    return ;
                                }

                                if (params.operation === 'save') {

                                    if (!isRecordMatchDataInfo(dataInfo, params.record)) {
                                        return;
                                    }

                                    isDataInfoMatch = true;

                                    newPoint = recordToPoint(params.record);
                                    index = findPosition(newPoint, seriesObj.data);

                                    // save old record: not handle
                                    if (index === 0 && newPoint.x !== seriesObj.data[index].x && seriesObj.data.length === config.limit) {
                                        return;
                                    }

                                    isTimeMatch = true;

                                    if(!isRecordMatchSeries(dataInfo, record, params.record)){
                                        return ;
                                    }

                                    isSeriesMatch = true;

                                    // should add a new point
                                    if (index === -1 || newPoint.x !== seriesObj.data[index].x) {
                                        var shift = seriesObj.data.length === config.limit;

                                        seriesObj.addPoint([newPoint.x, newPoint.y], false, shift);
                                    }
                                    // should update point series.data[index]
                                    else {
                                        y = seriesObj.data[index].y + params.record.value;
                                        seriesObj.data[index].update(y);
                                    }

                                    isRefresh = true;
                                }

                                if (params.operation === 'update') {
                                    if (!isRecordMatchDataInfo(dataInfo, params.record)) {
                                        return;
                                    }

                                    newPoint = recordToPoint(params.record);
                                    index = findPosition(newPoint, seriesObj.data);

                                    if (index === -1 || newPoint.x !== seriesObj.data[index].x) {
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
                                    index = findPosition(newPoint, seriesObj.data);

                                    if (index === -1 || newPoint.x !== seriesObj.data[index].x) {
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
                                        index = findPosition(newPoint, seriesObj.data);

                                        if (index === -1 || newPoint.x !== seriesObj.data[index].x) {
                                            return;
                                        }

                                        if(!isRecordMatchSeries(dataInfo, record, rec)){
                                            return ;
                                        }

                                        isReload = true;
                                        return true;
                                    });
                                }

                            });

                        });

                        // a new series should be added: reload
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