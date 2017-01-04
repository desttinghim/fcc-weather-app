(function (console) { "use strict";
var Main = function() { };
Main.main = function() {
	console.log("Happy New Year!");
};
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
