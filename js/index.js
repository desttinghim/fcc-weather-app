(function (console, $hx_exports) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { };
DateTools.delta = function(d,t) {
	var t1 = d.getTime() + t;
	var d1 = new Date();
	d1.setTime(t1);
	return d1;
};
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
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Main = $hx_exports.Main = function() { };
Main.main = function() {
	if(js_Cookie.exists("lastRequestTime")) {
		var s = js_Cookie.get("lastRequestTime");
		Main.lastRequestTime = HxOverrides.strDate(s);
	}
	if(js_Cookie.exists("weather")) {
		Main.weather = JSON.parse(js_Cookie.get("weather"));
		Main.parseWeather(Main.weather);
	}
	window.navigator.geolocation.getCurrentPosition(Main.positionCallback);
};
Main.positionCallback = function(pos) {
	var lat;
	var $long;
	lat = pos.coords.latitude;
	$long = pos.coords.longitude;
	Main.requestWeather(lat,$long);
};
Main.requestWeather = function(lat,$long) {
	var currentTime = new Date();
	var timeSinceLastRequest = currentTime.getMinutes() - Main.lastRequestTime.getMinutes();
	if(timeSinceLastRequest < 10) {
		var timeToWait = 10 - timeSinceLastRequest;
		window.console.log("Please wait " + timeToWait + " minutes for new weather.");
		window.setTimeout(Main.requestWeather,timeToWait * 60 * 10000 + 1);
		Main.parseWeather(Main.weather);
		return;
	} else window.console.log("Getting weather...");
	Helpers.ajax({ url : "http://api.openweathermap.org/data/2.5/weather", options : (function($this) {
		var $r;
		var _g = new haxe_ds_StringMap();
		if(__map_reserved.id != null) _g.setReserved("id","524901"); else _g.h["id"] = "524901";
		if(__map_reserved.APPID != null) _g.setReserved("APPID","06d6414fcf6bc783d1f3249c2a44fa81"); else _g.h["APPID"] = "06d6414fcf6bc783d1f3249c2a44fa81";
		_g.set("lat",lat == null?"null":"" + lat);
		_g.set("long",$long == null?"null":"" + $long);
		if(__map_reserved.callback != null) _g.setReserved("callback","Main.weatherCallback"); else _g.h["callback"] = "Main.weatherCallback";
		$r = _g;
		return $r;
	}(this))});
	Main.lastRequestTime = currentTime;
	js_Cookie.set("lastRequestTime",HxOverrides.dateStr(Main.lastRequestTime));
};
Main.weatherCallback = function(response) {
	Main.weather = response;
	js_Cookie.set("weather",JSON.stringify(response));
	Main.parseWeather(response);
};
Main.parseWeather = function(weather) {
	if(weather == null) {
		window.console.log("Weather is null - wait for response.");
		return;
	}
	Helpers.getEl("location").innerHTML = "" + weather.name + ", " + weather.sys.country;
	Helpers.getEl("temperature").innerHTML = weather.main.temp;
	Helpers.getEl("description").innerHTML = weather.weather[0].description;
	Helpers.getEl("icon").setAttribute("src","http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png");
};
var StringTools = function() { };
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
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
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
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
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_Cookie = function() { };
js_Cookie.set = function(name,value,expireDelay,path,domain) {
	var s = name + "=" + encodeURIComponent(value);
	if(expireDelay != null) {
		var d = DateTools.delta(new Date(),expireDelay * 1000);
		s += ";expires=" + d.toGMTString();
	}
	if(path != null) s += ";path=" + path;
	if(domain != null) s += ";domain=" + domain;
	window.document.cookie = s;
};
js_Cookie.all = function() {
	var h = new haxe_ds_StringMap();
	var a = window.document.cookie.split(";");
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		e = StringTools.ltrim(e);
		var t = e.split("=");
		if(t.length < 2) continue;
		h.set(t[0],decodeURIComponent(t[1].split("+").join(" ")));
	}
	return h;
};
js_Cookie.get = function(name) {
	return js_Cookie.all().get(name);
};
js_Cookie.exists = function(name) {
	return js_Cookie.all().exists(name);
};
var __map_reserved = {}
Main.lastRequestTime = HxOverrides.strDate("00:00:00");
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);
