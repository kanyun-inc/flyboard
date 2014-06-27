/*
*	Author: Ben Goodyear
*	Version: 1.0 / 30.12.13
*/


/*
*	R.A.G Charts
* 	- Creates a R.A.G chart see http://controlfrog.hammer.dev/documentation.html#cfmodule-rag for details
*
*	@param 	id		String	the id of the chart
*	@param	data	Array	an array of values for the chart
*	@param	labels	Array	an array of labels for the corresponding values
*	@param	options	Object	a JSON options object
*
*/
function RagChart(id, data, labels, options){
	//console.log('rag chart',id,data,labels,options);
	
	var id = '#'+id;
	var rd = data;
	var rl = labels;
	var opts = (typeof options == undefined) ? {} : options;
	var rt = new Number;
	var rgaLength = new Number;	
	var rda = [];
	var rga = ['m-red','m-amber','m-green'];
	var rgaLi = '';
	
	this.init = function(){
		if(opts && opts.rgaLength) {
			rgaLength = opts.rgaLength;
			rgaLi = 100/rgaLength;		
			rgaLi = ' style="height:'+rgaLi+'%;"';
		}
		else {
			rgaLength = 3;
		}
	
		// Calculate total
		for(var i=0; i<rgaLength; i++){
			rt = rt + rd[i];
			rda[i] = rd[i];
		}
		// Calculate actual values	
		for(var i=0; i<rgaLength; i++){
			rda[i] = rd[i]/rt * 100;
		}	
		
		this.render();
	};
	
	this.update = function(nd){
		// update chart values
		// Pass an array of new values. You must pass a complete data set.
		// If you want a value to remain the same pass 'null' in it's place
		
		
		// Merge new values with existing, null means no change
		var ud = [];
		for(var i=0; i<nd.length; i++){
			if(nd[i] == null){
				ud[i] = rd[i];
			}
			else {
				ud[i] = nd[i];
			}
		}
		
		rd = ud;
		rt = new Number;
		
		this.init();
	};
	
	this.render = function(){
		// Generate the html for the chart
	
		var html = '';
		
		if(opts && opts.type == 'figsOnly'){
			html += this.renderFigs();
			html += this.renderLabels();
		}
		else{
			html += this.renderBars();
			html += this.renderFigs();
			html += this.renderLabels();
		}		
		
		// Populate final html
		$(id).html(html);
	}
	
	this.renderBars = function(){
		// Bar html
		
		var html = '<div class="cf-bars"><ul>';
		for(i=0; i<rgaLength; i++){
			if(opts && opts.customColor){
				html += '<li style="height: '+rda[i]+'%"><div class="cf-bars-bar" style="background-color: '+opts.customColor[i]+';"></div></li>';
			}
			else {
				if(rga[i] == undefined){
					var rgai = 'mb-missing';
				}
				else {
					var rgai = rga[i];
				}
				html += '<li style="height: '+rda[i]+'%"><div class="cf-bars-bar '+rgai+' mb"></div></li>';			
			}
		}
		html += '</ul></div>';
		
		return html;
	};
	
	this.renderFigs = function(){
		// Figure html
		
		var postfix = '';
		if(opts && opts.postfix){
			postfix = opts.postfix;
		}
		var typeC = '';
		if(opts && opts.type == 'figsOnly'){
			typeC = 'cf-figs-only';
		}
		
		var html = '<div class="cf-figs '+typeC+'"><ul>';
		for(i=0; i<rgaLength; i++){
			if(opts && opts.customColor){
				html += '<li'+rgaLi+'><div class="cf-figs-fig"><p style="color: '+opts.customColor[i]+';">'+rda[i].toFixed(0)+''+postfix+'</p></div></li>';			
			}
			else{
				if(rga[i] == undefined){
					var rgai = 'm-missing';
				}
				else {
					var rgai = rga[i];
				}

				html += '<li'+rgaLi+'><div class="cf-figs-fig '+rgai+'"><p>'+rda[i].toFixed(0)+''+postfix+'</p></div></li>';				
			}
		}
		html += '</ul></div>';
		
		return html;
	}
	
	this.renderLabels = function(){
		// Label html
		
		var typeC = '';
		if(opts && opts.type == 'figsOnly'){
			typeC = 'cf-txts-only';
		}
		
		var html = '<div class="cf-txts '+typeC+'"><ul>';
		for(i=0; i<rgaLength; i++){
			if(opts && opts.customColor){
                html += '<li'+rgaLi+'><div class="cf-txts-txt" style="color: '+opts.customColor[i]+';"><p>'+rl[i]+'</p></div></li>';
            }
            else{
            	if(rga[i] == undefined){
					var rgai = 'm-missing';
				}
				else {
					var rgai = rga[i];
				}

				html += '<li'+rgaLi+'><div class="cf-txts-txt '+rgai+'"><p>'+rl[i]+'</p></div></li>';
            }
		}
		html += '</ul></div>';
		
		return html;
	}
	
	// Initialise chart
	this.init();
}

/*
*	Funnel Charts
* 	- Creates a funnel chart see http://controlfrog.hammer.dev/documentation.html#cfmodule-funnel for details
*
*	@param 	id		String	the id of the chart
*	@param	data	Array	an array of values for the chart
*	@param	labels	Array	an array of labels for the corresponding values
*	@param	options	Object	a JSON options object
*
*/function FunnelChart(id, data, labels, options){
	//console.log('funnel chart', id, data, labels, options);
	
	var id = '#'+id;
	var fd = data;
	var fl = labels;
	var opts = (typeof options == undefined) ? {} : options;
	var fll = fd.length;
	var ft = fd[0];
	var fdp =[];
	var oi = 0.5/fll;
	var h = '';

	
	this.init = function(){
		// Calculate percentages for bars
		for(var i=0; i<fll; i++){
			fdp[i] = fd[i]/ft * 100;
			if(fdp[i] < 1 && fdp[i] > 0){
				fdp[i] = 1;
			}
			else {
				fdp[i] = Math.round(fdp[i]);
			}
		}
		
		// Custom colours
		if(opts && opts.customColors){
			if(opts.customColors.length != fll && opts.customColors.length > 1){
				for(var i=0; i<fll; i++){
					if(!opts.customColors[i]){
						opts.customColors[i] = '#f6f6f6';
					}				
				}
			}
			else {
				for(var i=0; i<fll; i++){
					opts.customColors[i] = opts.customColors[0];
				}
			}
		}
		
		// Make sure we fill in missing labels
		for(var i=0; i<fll; i++){
			if(fl[i] == undefined ){
				fl[i] = '-';
			}
		}
		
		// Bar height
		h = 'height: '+(100/fll)+'%;';
	
		this.render(); 
	}
	
	this.update = function(nd){
		// update chart values
		// Pass an array of new values. You must pass a complete data set.
		// If you want a value to remain the same pass 'null' in it's place

		// Merge new values with existing, null means no change
		var ud = [];
		for(var i=0; i<nd.length; i++){
			if(nd[i] == null){
				ud[i] = fd[i];
			}
			else {
				ud[i] = nd[i];
			}
		}
		
		fd = ud;
		ft = fd[0];
		
		this.init();

	}
		
	this.render = function(){
		// Generate the html for the chart
		var html = '';
		
		
		if(opts && opts.layout == 'right'){
			html += this.renderFigs();
			html += this.renderFunnel();
		}
		else{
			html += this.renderFunnel();
			html += this.renderFigs();
		}
		
		// Populate final html
		$(id).html(html);
	}
	
	this.renderFunnel = function(){
		if(opts && opts.layout == 'right'){
			fc = 'cf-funnels-right';
		}
		else{
			fc = 'cf-funnels-left';		
		}
	
		var html = '<div class="cf-funnels '+fc+'"><ul>';
		for(var i=0; i<fll; i++){

			if(opts && opts.barOpacity && opts.barOpacity != false){
				os = 0.6+(i*oi);
			}
			else{
				os = 1;
			}
		
			if(opts && opts.customColors){
				html += '<li style="'+h+' width:'+fdp[i]+'%; opacity:'+os+'; background-color: '+opts.customColors[i]+'"></li>';
			}
			else{
				html += '<li class="m-green mb" style="'+h+' width:'+fdp[i]+'%; opacity:'+os+'"></li>';
			}
		}
		
		html += '</ul></div>';
	
		return html;
	}
	
	this.renderFigs = function(){
		var html = '<div class="cf-figstxts"><ul>';
		
		for(var i=0; i<fll; i++){
			if(opts && opts.metricOpacity && opts.metricOpacity != false){
				os = 0.6+(i*oi);
			}
			else{
				os = 1;
			}
		
			if(opts && opts.customColors){
				html += '<li style="'+h+'"><div><p class="metric" style="opacity:'+os+'; color:'+opts.customColors[i]+'">'+fd[i]+'</p></div><div><p>'+fl[i]+'</p></div></li>';
			}
			else{
				html += '<li style="'+h+'"><div><p class="metric m-green mc" style="opacity:'+os+'">'+fd[i]+'</p><p>'+fl[i]+'</p></div></li>';
			}
		}
		
		html += '</ul></div>';
	
		return html;
	}
	
	// Initialise chart
	this.init();
}


