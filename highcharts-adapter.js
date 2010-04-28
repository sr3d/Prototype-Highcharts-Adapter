var HighchartsAdapter = {
	
	addEvent: function (el, event, fn){
		Event.observe(el, event, fn);
	},
	
	animate: function (el, params, options) { // temporarily done
		var string = $H(params).collect(function(pair){ return [pair.key,pair.value].join(':');}).join(';');
		if(options) $w('duration', 'delay').each(function(time){ options[time] = (!!(options[time]) ? options[time]/1000.0 : 0);});
		$(el).morph(string, options);
	},
	
	each: function(arr, fn) { // done
		arr.each(fn);
	},
	
	fireEvent: function(el, event, eventArguments, defaultFunction) { // done
		if(event.preventDefault){
			defaultFunction = null;
		}
		if(el.fire)
			el.fire(event, eventArguments);
		else if(el.container)
			el.container.fire(event, eventArguments);
		
		
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
	}
};