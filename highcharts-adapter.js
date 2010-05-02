if(typeof Prototype == 'undefined')
{
	throw "Highcharts Adapter Error: Prototype has not been loaded.\n\tPlease load prototype prior to loading the highcharts adapter."
}

var HighchartsAdapter = {
	
	addEvent: function (el, event, fn){
		if(el.attachEvent)
			Event.observe(el, event, fn);
		else{
			HighchartsAdapter._extend(el);
			el.observe_event(event, fn);
		}
	},
	
	animate: function (el, params, options) { // temporarily done
		
		var string = $H(params).collect(function(pair){ return [pair.key,pair.value].join(':');}).join(';');
		if(options) $w('duration', 'delay').each(function(time){ options[time] = (!!(options[time]) ? options[time]/1000.0 : 0);});
		if(typeof Effect != 'undefined')
			$(el).morph(string, options);
		else
			$(el).setStyle(string);
	},
	
	each: function(arr, fn) { // done
		arr.each(fn);
	},
	
	fireEvent: function(el, event, eventArguments, defaultFunction) { // done
		if(event.preventDefault){
			defaultFunction = null;
		}
		
		if(el.attachEvent)
			el.fire(event, eventArguments);
		else if(el._highcharts_extended){
			el.fire_event(event, eventArguments);
		}
		
		
		if(defaultFunction) defaultFunction(event);
	},
	
	getAjax: function (url, callback) { // done
		new Ajax.Request(url, {
			method: 'get',
			onSuccess: function(obj) {
				callback(obj.responseText);
			}
		});
	},
	
	grep: function(arr, fn) { // done
		return arr.findAll(fn);
	},
	
	hyphenate: function (str) { // done
		return str.replace(/([A-Z])/g, function(a, b){ return '-'+ b.toLowerCase() });
	},
	
	map: function(arr, fn) { // done
		return arr.collect(fn);
	},
	
	merge: function(){
		function doCopy(copy, original) {
			var value;
			for (var key in original) {
				value = original[key];
				if  (value && typeof value == 'object' && value.constructor != Array) { 
					copy[key] = doCopy(copy[key] || {}, value); // copy

				} else {
					copy[key] = original[key];
				}
			}
			return copy;
		}
		function merge() {
			var args = arguments,
				retVal = {};

			for (var i = 0; i < args.length; i++) {
				retVal = doCopy(retVal, args[i])

			}
			return retVal;
		}
		return merge.apply(this, arguments);
	},
	
	warn : function(text)
	{
		try{ console.warn(text); } catch(e){}
	}
};

HighchartsAdapter._extend = function(object){
	if(!object._highcharts_extended)
		Object.extend(object, {
			_highchart_events : {}, 
			_highcharts_extended : true,
			observe_event : function(name, fn){
				this._highchart_events[name] = [this._highchart_events[name], fn].compact().flatten();
			},
			fire_event : function(name, args){
				(this._highchart_events[name] || []).each(function(fn){
					if(args.stopped) 
						return; // "throw $break" wasn't working. i think because of the scope of 'this'.
					fn.bind(this)(args);
				}.bind(this));
			}});
};

if(typeof Effect == 'undefined')
{
	HighchartsAdapter.warn('effects.js was not loaded, animations will not occur.')
}