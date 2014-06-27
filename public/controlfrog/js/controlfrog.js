// Colour settings
if(themeColour == 'white'){
	var metric = '#a9a9a9';
	var backColor = '#7d7d7d';
	var pointerColor = '#898989'; 	
	var pageBackgorund = '#fff';
	var pieTrack = metric;
	var pieBar = backColor;
	var gaugeTrackColor = metric;
	var gaugeBarColor = backColor;
	var gaugePointerColor = '#ccc';
	var pieSegColors = [metric,'#868686','#636363','#404040','#1d1d1d'];	
}
else {
	//default to black
	var backColor = '#4f4f4f';
	var metric = '#f2f2f2';	
	var pointerColor = '#898989'; 
	var pageBackgorund = '#2b2b2b';	
	var pieSegColors = [metric,'#c0c0c0','#8e8e8e','#5b5b5b','#292929'];
	var pieTrack = backColor;
	var pieBar = metric;
	var gaugeTrackColor = '#4f4f4f';
	var gaugeBarColor = '#898989';
	var gaugePointerColor = metric;
}

// Stores
var cf_rSVPs = [];
var cf_rGs = [];
var cf_rLs = [];
var cf_rPs = [];
var cf_rRags = [];
var cf_rFunnels = [];

$(document).ready(function(){

	// Make items square
	cfSizeItems();
	
	// Navigation 
	$('.cf-nav-toggle').click(function(e){

		if( $('.cf-nav').hasClass('cf-nav-state-min') ){
			$('.cf-nav').removeClass('cf-nav-state-min').addClass('cf-nav-state-max');
			$('.cf-container').addClass('cf-nav-state-max');
		}
		else{
			$('.cf-nav').removeClass('cf-nav-state-max').addClass('cf-nav-state-min');		
			$('.cf-container').removeClass('cf-nav-state-max');			
		}
		
		e.preventDefault();
	});
		
	// Time and date display 
	(function updateTime(){
		var now = moment();
		
		$('.cf-td').each(function(){
			if($(this).hasClass('cf-td-12')){
				$('.cf-td-time', $(this)).html(now.format('h:mm'));
				ampm = now.format('a');
				$('.cf-td-time', $(this)).append('<span>'+ampm+'</span>');
			}
			else{
				$('.cf-td-time', $(this)).html(now.format('HH:mm'));
			}

			$('.cf-td-day', $(this)).html(now.format('dddd'));   			
			$('.cf-td-date', $(this)).html(now.format('MMMM Do YYYY'));   
		});
	
		setTimeout(updateTime, 3000);
	})();
	
	// Open links from RSS Module in a new window
	$('.cf-rss a').each(function(){
		$(this).prop('target', '=_blank');
	});
	
}); // end doc ready


/*
*
* Pie charts (cf-pie)
*
*/
$(document).ready(function(){

	// Default Pie chart options
	window.cf_DefaultPieOpts = {};
	cf_DefaultPieOpts.segmentShowStroke = false;

	
	
	// Initialise chart
	/*
	*	Copy the each() function for each line chart you have
	* 	e.g. $('#pie-1').each(function(){.....}
	*/
	$('.cf-pie').each(function(){
		// Data for pie chart
		var pdata = [
			{
				value : 30,
				color : pieSegColors[3],
				label: 'Label 1'
			},
			{
				value : 50,
				color : pieSegColors[2],
				label: 'Label 2'			
			},
			{
				value: 100,
				color: pieSegColors[1],
				label: 'Label 3'			
			}
		]
	
		var $container = $(this);
		var pId = $container.prop('id');
		
		// Store chart information
		cf_rPs[pId] = {};
		cf_rPs[pId].data = pdata;
		
		/*
		// Set options per chart		
		customOptions = {};
		customOptions.animation = false;
		cf_rPs[pId].options = customOptions;
		*/
		
		// Create chart
		createPieChart($container);
	});
	
}); // end doc ready

function createPieChart(obj){
	$(window).resize(generatePieChart);

	function generatePieChart(){
		$container = obj;
		pId = $container.prop('id');
		var $canvas = $('canvas', $container);
		var cWidth = $container.width()*0.50;
		var cHeight = $container.height();		
		
		// Safari 5.1.10 .height() bug
		if(cHeight == 0){
			cHeight = cWidth - 28;
		}

		//Set canvas size
		$canvas.prop({width:cWidth,height:cHeight});
	
		// Get canvas context		
		var ctx = $canvas.get(0).getContext('2d');
		
		// Check for custom options
		var pieOptions;
		if(cf_rPs[pId].options){
			var pieOptions = $.extend({}, cf_DefaultPieOpts, cf_rPs[pId].options);
		}
		else{
			pieOptions = cf_DefaultPieOpts;
		}

		// Create chart		
		new Chart(ctx).Pie(cf_rPs[pId].data,pieOptions);
		createPieLegend(pId);
	}
	
	function createPieLegend(pId){
		// Check if we've already generated the legend
		if(cf_rPs[pId].legend){
			$('#'+pId).append(pieLegendHtml);			
		}
		else{
			// generate legend
			var pieLegendRow = '';
			var pieLegendHtml = '';
			
			for(i in cf_rPs[pId].data){
				pieLegendRow += '<li><div class="cf-pie-legend-color" style="background-color:'+cf_rPs[pId].data[i].color+'"></div>'+cf_rPs[pId].data[i].label+'</li>';
			}
			pieLegendHtml += '<div class="cf-pie-legend"><ul>'+pieLegendRow+'</ul></div>';
			$('#'+pId).append(pieLegendHtml);
			cf_rPs[pId].legend = pieLegendHtml;
		}
	}
	
	// Call once on page load
	generatePieChart();
}

/*
*
* Line charts (cf-line)
*
*/
$(document).ready(function(){

	// Default line chart options
	window.cf_lineDefaultOpts = {};
	cf_lineDefaultOpts.datasetFill = false;
	cf_lineDefaultOpts.scaleMaxMinLabels = true;
	cf_lineDefaultOpts.scaleShowGridLines = false;
	cf_lineDefaultOpts.pointDot = false;
	cf_lineDefaultOpts.scaleLineColor = 'transparent';
	cf_lineDefaultOpts.bezierCurve = false;
	cf_lineDefaultOpts.scaleFontSize = 10;


	// Initialise chart
	/*
	*	Copy the each() function for each line chart you have
	* 	e.g. $('#line-1').each(function(){.....}
	*/	
	$('.cf-line').each(function(){
		// Dummy data for line chart
		var ldata = {
			labels : ["5/13","","","","","","11/13"],
			datasets : [
				{
					strokeColor : metric,
					data : [65,59,40,81,56,55,90]
				}
			]
		}
	
		var $container = $(this);
		var lId = $container.prop('id');
		
		// Store chart information
		cf_rLs[lId] = {};
		cf_rLs[lId].data = ldata;
		
		/*
		// Set options per chart
		customOptions = {};
		customOptions.scaleMaxMinLabels = false;
		cf_rLs[lId].options = customOptions;
		*/
		
		// Create chart
		createLineChart($container);
	});
	
}); // end doc ready

function createLineChart(obj){
	$(window).resize(generateLineChart);

	function generateLineChart(){
		$container = obj;
		lId = $container.prop('id');

		var $canvas = $('canvas', $container);
		var cWidth = $container.width();
		var cHeight = $container.height();		
		
		console.log(cWidth, cHeight);

		// Get canvas context		
		var ctx = $canvas.get(0).getContext('2d');

		//Set canvas size
		$canvas.prop({width:cWidth,height:cHeight});
		
		// Check for custom options
		var lineOptions;
		if(cf_rLs[lId].options){
			var lineOptions = $.extend({}, cf_lineDefaultOpts, cf_rLs[lId].options);
		}
		else{
			lineOptions = cf_lineDefaultOpts;
		}

		// Create chart		
		new Chart(ctx).Line(cf_rLs[lId].data,lineOptions);
	}
	
	// Call once on page load
	generateLineChart();
}


/*
*
* Sparklines (cf-svmc-sparkline)
*
*/
$(document).ready(function(){
	
	// Set up default options	
	window.cf_defaultSparkOpts = {};
	cf_defaultSparkOpts.fillColor = false;
	cf_defaultSparkOpts.lineColor = metric;
	cf_defaultSparkOpts.lineWidth = 1.5;
	cf_defaultSparkOpts.minSpotColor = false;
	cf_defaultSparkOpts.maxSpotColor = false;
	cf_defaultSparkOpts.spotRadius = 2.5;
	cf_defaultSparkOpts.highlightLineColor = metric;
	cf_defaultSparkOpts.spotColor = '#f8f77d';
	
	// Initialise sparklines
	/*
	*	Copy the each() function for each sparkline you have
	* 	e.g. $('#spark-1').each(function(){.....}
	*/	
	$('.sparkline').each(function(){
		
		/*
		// Set custom options and merge with default
		customSparkOptions = {};
		customSparkOptions.minSpotColor = true;
		var sparkOptions = cf_defaultSparkOpts;
		var sparkOptions = $.extend({}, cf_defaultSparkOpts, customSparkOptions);
		*/
		
		// No custom options
		var sparkOptions = cf_defaultSparkOpts;
			
		data = 	[2343,1765,2000,2453,2122,2333,2666,3000,2654,2322,2500,2700,2654,2456,2892,3292];
		createSparkline($(this), data, sparkOptions);
	});	
});

function createSparkline(obj, data, sparkOptions){
	
	$(window).resize(generateSparkline);
	
	function generateSparkline(){
		var ww = $(window).width();
		var $obj = obj;			
		var $parent = $obj.parent().parent();
	
		// Current value
		$('.sparkline-value .metric-small', $parent).html(data[data.length-1]);
	
		// Sizing
		if(ww < 768){
			var cWidth = $parent.width();
			var slWidth = Math.floor(cWidth/3);
		}
		else{
			var svWidth = $('.sparkline-value', $parent).width();
			var cWidth = $parent.width();
			var slWidth = cWidth - svWidth - 20;
			var cHeight = $parent.parent().outerHeight() - 35;
			var svmHeight = $('.cf-svmc', $parent).height();
			var slHeight = cHeight - svmHeight;
			$('.sparkline-value', $parent).css({height:slHeight});
		}	
	
		// Options
		sparkOptions.width = slWidth;
		sparkOptions.height = slHeight;		
	
		// Create sparkline
		$obj.sparkline(data, sparkOptions);
	}
	
	// Call once on page load
	generateSparkline();
}


/*
*
*	Gauge (cf-gauge)
*
*/
$(document).ready(function(){
	//Initialise gauges to default 
	$('.cf-gauge').each(function(){

		// Gather IDs 
		var gId = $(this).prop('id');					// Gauge container id e.g. cf-gauge-1
		var gcId = $('canvas', $(this)).prop('id');		// Gauge canvas id e.g. cf-gauge-1-g
		var gmId = $('.metric', $(this)).prop('id');  	// Gauge metric id e.g. cf-gauge-1-m

		//Create a canvas
		var ratio = 2.1;
		var width = $('.canvas',$(this)).width();
		var height = Math.round(width/ratio);
		$('canvas', $(this)).prop('width', width).prop('height', height);

		// Set options  	
		rGopts = {};
		rGopts.lineWidth = 0.30;
		rGopts.strokeColor = gaugeTrackColor;
		rGopts.limitMax = true;
		rGopts.colorStart = gaugeBarColor;
		rGopts.percentColors = void 0;	
		rGopts.pointer = {
			length: 0.7,
			strokeWidth: 0.035,
			color: gaugePointerColor
		};

		// Create gauge
		cf_rGs[gId] = new Gauge(document.getElementById(gcId)).setOptions(rGopts);
		cf_rGs[gId].setTextField(document.getElementById(gmId));

		// Set up values for gauge (in reality it'll likely be done one by one calling the function, not from here)
		updateOpts = {'minVal':'0','maxVal':'1000','newVal':'500'};
		gaugeUpdate(gId, updateOpts);


		// Responsiveness	
		$(window).resize(function(){
		
			//Get canvas measurements
			var ratio = 2.1;
			var width = $('.canvas', $('#'+gId)).width();
			var height = Math.round(width/ratio);

			cf_rGs[gId].ctx.clearRect(0, 0, width, height);
			$('canvas', $('#'+gId)).width(width).height(height);
			cf_rGs[gId].render();
		});

	});
});

/*
*	Set or update a Gauge
*	@param gauge 	string 		ID of gauge container
*	@param opts 	object		JSON object of options
*/
function gaugeUpdate(gauge, opts){
	if(opts.minVal){
		$('.val-min .metric-small', $('#'+gauge)).html(opts.minVal);		
		cf_rGs[gauge].minValue = opts.minVal;
	}
	if(opts.maxVal){
		cf_rGs[gauge].maxValue = opts.maxVal;
		$('.val-max .metric-small', $('#'+gauge)).html(opts.maxVal);
	}
	if(opts.newVal){
		cf_rGs[gauge].set(parseInt(opts.newVal));
	}
}


/*
*
* R.A.G
*
*/
$(document).ready(function(){
	/*
	*	Copy the each() function for each R.A.G chart you have
	* 	e.g. $('#cf-rag-1').each(function(){.....}
	*/								
	$('.cf-rag').each(function(){
		// Dummy data for RAG
		ragData = [40,50,10];
		ragLabels = ['Red','Amber','Green'];
		ragOpts = {postfix:'%'}

		cf_rRags[$(this).prop('id')] = new RagChart($(this).prop('id'), ragData, ragLabels, ragOpts);
	});
}); // end doc ready

/*
*
* Funnel charts
*
*/
$(document).ready(function(){
	/*
	*	Copy the each() function for each Funnel chart you have
	* 	e.g. $('#cf-funnel-1').each(function(){.....}
	*/								

	$('.cf-funnel').each(function(){
	
		// Dummy data for Funnel chart
		funData = [3000,1500,500,250,10];
		funLabels = ['Visits','Cart','Checkout','Purchase','Refund'];
		funOptions = {barOpacity:true};
		
		cf_rFunnels[$(this).prop('id')] = new FunnelChart($(this).prop('id'), funData, funLabels, funOptions);
	});
	
}); // end doc ready





/*
*
* Single Value Pie Charts (cf-svp)
*
*/
$(document).ready(function(){

	// Initialise single value pie charts
	$('.cf-svp').each(function(){
		cf_rSVPs[$(this).prop('id')] = {};
		rSVP($(this));
	});
	
	// Update a single value pie chart
	// -- Example of how to update a chart, can be used in other cases than from a button click
	$('.svp-update').click( function(){
		var element = $(this).data('update');
		
		// Call EasyPieChart update function
		cf_rSVPs[element].chart.update(12);
		// Update the data-percent so it redraws on resize properly
		$('#svp-1 .chart').data('percent', 12);
		// Update the UI metric
		$('.metric', $('#'+element)).html('12');
	});
});


/*
*	Create single value pie charts
*/
function rSVP(element, options){
	// Call the chart generation on window resize
	$(window).resize(generateChart);
	
	var container = $(element);
	var chart = '#'+$(element).attr('id')+' .chart';
	

	// Create the chart
	function generateChart(){
		
		// Resize when width is 768 or greater 
		// Remove any existing canvas                
		if($('canvas', $(container)).length){
			$.when($('canvas', $(container)).remove()).then(addChart());
		}
		else{
			addChart();
		}
		
		function addChart(){
			//Setup options
			var rsvpOpt = {
				barColor: pieBar,
				trackColor: pieTrack,
				scaleColor: false,
				lineWidth: 15,			
				lineCap: 'butt',
				size: 100
			};
			
			//Alter settings depending on layout and screen width
			var ww = $(window).width();
			
			if(ww > 767 && ww < 992){
				rsvpOpt.size = container.width()-10;
										
				switch($(chart).data('layout')){
					case 'l-6':
						rsvpOpt.lineWidth = 30;
						break;
					
					case 'l-6-i':
						rsvpOpt.lineWidth = 20;
						rsvpOpt.size = parseFloat((container.width()*0.7)-10);
						break;					
					
					case 'l-6-12-6':
						break;
					
					case 'l-6-4':
						rsvpOpt.lineWidth = 5;	
						break;
				}
			}
			else if(ww > 991 && ww < 1200 ){
				rsvpOpt.size = container.width()-10;
										
				switch($(chart).data('layout')){
					case 'l-6':
						rsvpOpt.lineWidth = 30;
						break;
					
					case 'l-6-i':
						rsvpOpt.lineWidth = 30;
						rsvpOpt.size = parseFloat((container.width()*0.75)-10);
						break;					
					
					case 'l-6-12-6':
						rsvpOpt.lineWidth = 20;
						break;
					
					case 'l-6-4':
						rsvpOpt.lineWidth = 5;	
						break;
				}
			}
			else if(ww > 1199 && ww < 1399){
				rsvpOpt.size = container.width()-10;
										
				switch($(chart).data('layout')){
					case 'l-6':
						rsvpOpt.lineWidth = 40;
						break;
					
					case 'l-6-i':
						rsvpOpt.lineWidth = 30;
						rsvpOpt.size = parseFloat((container.width()*0.75)-10);
						break;					
					
					case 'l-6-12-6':
						rsvpOpt.lineWidth = 20;					
						break;
					
					case 'l-6-4':
						rsvpOpt.lineWidth = 10;	
						break;
				}
			}
			else if(ww > 1399){
				rsvpOpt.size = container.width()-10;
										
				switch($(chart).data('layout')){
					case 'l-6':
						rsvpOpt.lineWidth = 50;
						break;
					
					case 'l-6-i':
						rsvpOpt.lineWidth = 40;
						rsvpOpt.size = parseFloat((container.width()*0.75)-10);
						break;					
					
					case 'l-6-12-6':
						rsvpOpt.lineWidth = 30;
						break;
					
					case 'l-6-4':
						rsvpOpt.lineWidth = 15;	
						break;
				}
			}
			// Create and store the chart
			cf_rSVPs[$(element).attr('id')].chart = new EasyPieChart(document.querySelector(chart), rsvpOpt);
		}
	};

	// Run once on first load
	generateChart();
}

/*
*	Size modules 
*/
function cfSizeItems(){
	var width = $(window).width();

	$('.cf-item').each(function(){
		if(width > 767 ){
			$(this).height($(this).width());
		}
		else{
			$(this).height('auto');
		}
	});
}
// Call the resize function on window resize
$(window).resize(function(){
	cfSizeItems();
});

/*
*	Shorten large numbers
*/
function prettyNumber (number) {
    var prettyNumberSuffixes = ["", "K", "M", "bn", "tr"];
	var addCommas = function (nStr){
		var x = '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x)) {
			x = x.replace(rgx, '$1' + ',' + '$2');
		}
		return x;
	}
	var prettyNumber_rec = function (number, i) {
		if (i == prettyNumberSuffixes.length) {
			return addCommas(Math.round(number*1000)) + prettyNumberSuffixes[i-1];
		}
		if (number / 1000 >= 1) { // 1000+
			return prettyNumber_rec(number / 1000, ++i);
		}
		else {
			var decimals = number - Math.floor(number);
			if (decimals != 0) {
				if (number >= 10) { // 10 - 100
					number = Math.floor(number) + Math.round(decimals*10) / 10 + '';
					number = number.replace(/(.*\..).*$/, '$1');
				}
				else { // 0 - 10
					number = Math.floor(number) + Math.round(decimals*100) / 100 + '';
					number = number.replace(/(.*\...).*$/, '$1');
				}
				return number + prettyNumberSuffixes[i];
			}
			else {
				return Math.floor(number) + prettyNumberSuffixes[i];
			}
		}
	}
	return prettyNumber_rec(number, 0);
}