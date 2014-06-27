/**
 * Created by sly on 14-6-27.
 */

// Initialise sparklines
/*
*	Copy the each() function for each sparkline you have
* 	e.g. $('#spark-1').each(function(){.....}
*/
$('.widget[data-type=1]').each(function () {
    var config = $(this).data('config');
    $(this).find('.sparkline').each(function(){

    	/*
    	// Set custom options and merge with default
    	customSparkOptions = {};
    	customSparkOptions.minSpotColor = true;
    	var sparkOptions = cf_defaultSparkOpts;
    	var sparkOptions = $.extend({}, cf_defaultSparkOpts, customSparkOptions);
    	*/

    	// No custom options
    	var sparkOptions = cf_defaultSparkOpts;

    	data = 	[5,5,2,1,4,4,7,5,6,9,6,4,3,3,2,4];
    	createSparkline($(this), data, sparkOptions);
    });
})