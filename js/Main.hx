import js.Browser;
import js.Cookie;
import haxe.Json;

@:expose
class Main {
    public static var lastRequestTime = new Date(2017, 1, 1, 1, 1, 1);
    public static var weather;
    public static var tempUnit = 0;

    public static function main() {
        if (Cookie.exists("lastRequestTime")) {
            lastRequestTime = Date.fromString(Cookie.get("lastRequestTime"));
        }
        if (Cookie.exists("weather")) {
            weather = Json.parse(Cookie.get("weather"));
            parseWeather(weather);
        }
        // Can't use, requires secure (https) connection. However, I cannot
        // use the openweathermap API except on a HTTP connection.
        // Browser.navigator.geolocation.getCurrentPosition(positionCallback);
        Helpers.ajax({
            url: "http://ipinfo.io",
            options: [
                "callback" => "Main.positionCallback"
            ]
        });
        Helpers.getEl("temp-units").onclick = function() {
            setTempUnit(1 - Main.tempUnit);
        }
    }

    public static function positionCallback(pos) {
        var lat, long;
        var loc = pos.loc.split(",");
        lat = Math.round(Std.parseFloat(loc[0]));
        long = Math.round(Std.parseFloat(loc[1]));

        Browser.window.setInterval(requestWeather, 600000, lat, long);
        requestWeather(lat, long);
    }

    public static function requestWeather(lat, long) {
        var currentTime = Date.now();
        var timeSinceLastRequest = currentTime.getTime() - lastRequestTime.getTime();
        if (timeSinceLastRequest < 600000 && timeSinceLastRequest > 0) {
            // don't want to make too many requests
            Browser.console.log('$timeSinceLastRequest Cannot request data at this time.');
            parseWeather(weather);
            return;
        }
        Browser.console.log("Getting weather...");
        // Add code to limit calls
        Helpers.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather",
            options: [
            "id"        => "524901",
            "APPID"     => "06d6414fcf6bc783d1f3249c2a44fa81",
            "lat"       => Std.string(lat),
            "lon"       => Std.string(long),
            "callback"  => "Main.weatherCallback"
            ]
        });

        lastRequestTime = currentTime;
        Cookie.set("lastRequestTime", lastRequestTime.toString());
    }

    public static function weatherCallback(response) {
        Browser.console.log("Recieved weather data!");
        weather = response;
        Cookie.set("weather", Json.stringify(response));
        parseWeather(response);
    }

    public static function parseWeather(weather:Dynamic) {
        if (weather == null) {
            Browser.console.log("Weather is null - wait for response.");
            return;
        }
        Helpers.getEl("location").innerHTML = '${weather.name}, ${weather.sys.country}';
        Helpers.getEl("temperature").innerHTML =
            Std.string(Math.fround(Std.parseFloat(weather.main.temp) - 273.15));
        setTempUnit(tempUnit);
        Helpers.getEl("description").innerHTML = weather.weather[0].description;
        Helpers.getEl("icon").setAttribute("src", 'http://openweathermap.org/img/w/${weather.weather[0].icon}.png');
    }

    // 0 for celsius
    // 1 for fahrenheit
    public static function setTempUnit(unit) {
        if (weather == null) return;
        tempUnit = unit;
        if (unit == 0) {
            Helpers.getEl("temp-units").innerHTML = "C";
            Helpers.getEl("temperature").innerHTML =
                Std.string(Math.fround(Std.parseFloat(weather.main.temp) - 273.15));
        }
        if (unit == 1) {
            Helpers.getEl("temp-units").innerHTML = "F";
            Helpers.getEl("temperature").innerHTML =
                Std.string(Math.fround((Std.parseFloat(weather.main.temp) * (9.0/5.0)) - 459.67));
        }
    }
}
