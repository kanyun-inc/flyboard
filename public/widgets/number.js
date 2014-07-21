/**
 * Created by sly on 14-6-27.
 */

function getTimeFromRecord(record) {
    return new Date(record.year, record.month - 1, record.day, record.hour, record.minute, record.second).getTime();
}
// Initialise sparklines
/*
 *	Copy the each() function for each sparkline you have
 * 	e.g. $('#spark-1').each(function(){.....}
 */
$(function () {
    $('.widget[data-type=1]').each(function () {
        var config = $(this).data('config');
        var latestRecordId = undefined;

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        var $container = $(this).find('.content');

        $.get(
            '/api/data_sources/' + config.dataSourceId + '/records?limit=' + config.limit,
            function (resp) {
                var data = [];
                resp = resp || [];

                latestRecordId = resp[0].id;
                resp.reverse().forEach(function(record){
                    data.push({
                        x: getTimeFromRecord(record),
                        y: record.value
                    });
                });

                $container.highcharts({
                    chart: {
                        backgroundColor: '#2b2b2b',
                        type: 'spline',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function() {
                                // set up the updating of the chart each second
                                var series = this.series[0];
                                setInterval(function() {
                                    $.get(
                                            '/api/data_sources/' + config.dataSourceId + '/records?limit=' + config.limit,
                                        function(resp) {
                                            var flag = false;
                                            resp.reverse().filter(function(record){
                                                if(record.id === latestRecordId){
                                                    flag = true;
                                                    return false;
                                                }


                                                if (flag) {
                                                    series.addPoint([getTimeFromRecord(record), record.value], true, true);
                                                }
                                            });

                                            latestRecordId = resp[resp.length - 1].id;
                                    });
                                }, config.reloadInterval);
                            }
                        }
                    },
                    title: {
                        text: config.name
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        formatter: function() {
                                return '<b>'+ this.series.name +'</b><br/>'+
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                                Highcharts.numberFormat(this.y, 2);
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: config.name,
                        data: data,
                        color: '#46BFBD'
                    }],
                    plotOptions:{
                        spline: {
                            colors: ['#46BFBD', '#F7464A', '#FDB45C', '#949FB1', '#4D5360']
                        }
                    }
                });
            }
        );
    });
});
