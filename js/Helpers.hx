import js.Browser;

typedef AjaxRequest = {
    var url:String;
    // var method:String;
    // var format:String;
    // var callback:String;
    var options:Map<String, String>;
}

class Helpers {
    public static function getEl(el:String) {
        return Browser.document.getElementById(el);
    }

    public static function ajax(request:AjaxRequest) {
        var script = Browser.document.createScriptElement();
        script.src = request.url + "?";
        var first = true;
        for(key in request.options.keys()) {
            if (!first) script.src += "&";
            else first = false;
            script.src += '${key}=${request.options[key]}';
        }
        Browser.document.head.appendChild(script);
    }
}
