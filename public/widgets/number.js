/**
 * Created by sly on 14-6-27.
 */

// Initialise sparklines
/*
 *	Copy the each() function for each sparkline you have
 * 	e.g. $('#spark-1').each(function(){.....}
 */
$(function () {
    $('.widget[data-type=1]').each(function () {
        var $widget = $(this);
        var $metric = $widget.find('.metric');
        var $arrow = $widget.find('.arrow');
        var $large = $widget.find('.large');
        var $small = $widget.find('.small');
        var config = $(this).data('config');
        var $sparkline = $(this).find('.sparkline');

        /*
         // Set custom options and merge with default
         customSparkOptions = {};
         customSparkOptions.minSpotColor = true;
         var sparkOptions = cf_defaultSparkOpts;
         var sparkOptions = $.extend({}, cf_defaultSparkOpts, customSparkOptions);
         */

        // No custom options
        var sparkOptions = cf_defaultSparkOpts;

        /* dataSourceId: data_source_id
         * limit:3 == display the newest 3 records
         * */

        var limit = 30;
        var data;

        function reload(){
            $.get(
                '/api/data_sources/' + config.dataSourceId + '/records?limit=' + limit,
                function (resp) {
                    data = [];
                    resp.reverse().forEach(function (record) {
                        data.push(record.value);
                    });

                    var lastValue = data[data.length-2] || 0;
                    var det;
                    if(lastValue !== 0){
                        det = ((data[data.length-1] - lastValue)/lastValue) * 100;
                    }
                    else{
                        det = 100;
                    }

                    $metric.html(data[data.length-1]);
                    if( det > 0 ){
                        $arrow.removeClass('arrow-down');
                        $arrow.addClass('arrow-up');
                    }
                    else if(det < 0){
                        $arrow.removeClass('arrow-up');
                        $arrow.addClass('arrow-down');
                    }
                    else{
                        $arrow.removeClass('arrow-up arrow-down');
                    }
                    det = Math.abs(det).toFixed(2).toString().split('.');
                    $large.text(det[0]);
                    $small.text('.' + det[1] + '%');
                    createSparkline($sparkline, data, sparkOptions);
                },
                'json'
            );
        }

        setInterval(reload, config.reloadInterval);
        reload();
    });
});