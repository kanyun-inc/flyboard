/**
 * Created by sly on 14-6-27.
 */

// Initialise sparklines
/*
 *	Copy the each() function for each sparkline you have
 * 	e.g. $('#spark-1').each(function(){.....}
 */
$(function () {
    $('.widget[data-type=4]').each(function () {
        var $widget = $(this);
        var $metric = $widget.find('.metric');
        var $metricSmall = $widget.find('.metric-small');
        var $arrow = $widget.find('.arrow');
        var $large = $widget.find('.large');
        var $small = $widget.find('.small');
        var config = $(this).data('config');

        /*
         // Set custom options and merge with default
         customSparkOptions = {};
         customSparkOptions.minSpotColor = true;
         var sparkOptions = cf_defaultSparkOpts;
         var sparkOptions = $.extend({}, cf_defaultSparkOpts, customSparkOptions);
         */

        // No custom options

        function reload(){
            $.get(
                    '/api/data_sources/' + config.dataSourceId + '/records?limit=2')
                .then(
                function (resp) {
                    var det;

                    if( resp.length !== 2 || ( resp.length === 2 && resp[1] === 0 ) ) {
                        det = 0;
                    }
                    else {
                        det = ((resp[0].value - resp[1].value)/resp[1].value) * 100;
                    }

                    $metric.html(resp[0].value);

                    if( det > 0 ){
                        $arrow.removeClass('arrow-down');
                        $arrow.addClass('arrow-up');
                        $metricSmall.removeClass('m-green');
                        $metricSmall.addClass('m-red');
                    }
                    else {
                        $arrow.removeClass('arrow-up');
                        $arrow.addClass('arrow-down');
                        $metricSmall.removeClass('m-red');
                        $metricSmall.addClass('m-green');
                    }

                    det = Math.abs(det).toFixed(2).toString().split('.');
                    $large.text(det[0]);
                    $small.text('.' + det[1] + '%');

//                    generateSparkline();
                },
                'json'
            );
        }

//        function generateSparkline(){
//            var $container = $widget.find('.content');
//            var $obj = $widget.find('.cf-svmc');
//
//            var cw = $container.width(),
//                ch = $container.height(),
//                ow = $obj.width(),
//                oh = $obj.height();
//
//            $obj.css('margin-left', (cw - ow)/2);
//            $obj.css('margin-top', (ch - oh)/2);
//        }
//
//        $(window).resize(generateSparkline);

        setInterval(reload, config.reloadInterval);
        reload();
    });
});
