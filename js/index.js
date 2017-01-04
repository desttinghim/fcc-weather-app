(function (console) { "use strict";
var Helpers = function() { };
Helpers.getEl = function(el) {
	return window.document.getElementById(el);
};
Helpers.ajax = function(request) {
	var script;
	var _this = window.document;
	script = _this.createElement("script");
	script.src = request.url + "?";
	var first = true;
	var $it0 = request.options.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		if(!first) script.src += "&"; else first = false;
		script.src += "" + key + "=" + request.options.get(key);
	}
	window.document.head.appendChild(script);
};
var HxOverrides = function() { };
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Main = function() { };
Main.main = function() {
	window.navigator.geolocation.getCurrentPosition(Main.positionCallback);
};
Main.positionCallback = function(pos) {
	var lat;
	var $long;
	lat = pos.coords.latitude;
	$long = pos.coords.longitude;
	Helpers.ajax({ url : "api.openweathermap.org/data/2.5/weather", options : (function($this) {
		var $r;
		var _g = new haxe_ds_StringMap();
		_g.set("lat",lat == null?"null":"" + lat);
		_g.set("long",$long == null?"null":"" + $long);
		if(__map_reserved.callback != null) _g.setReserved("callback","Main.weatherCallback"); else _g.h["callback"] = "Main.weatherCallback";
		$r = _g;
		return $r;
	}(this))});
};
Main.weatherCallback = function(response) {
	console.log(response.main.temp);
};
var haxe_IMap = function() { };
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
};
var __map_reserved = {}
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
