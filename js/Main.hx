import js.Browser;
import js.Cookie;
import haxe.Json;

@:expose
class Main {
    public static var lastRequestTime = Date.fromString("00:00:00");
    public static var weather;

    public static function main() {
        if (Cookie.exists("lastRequestTime")) {
            lastRequestTime = Date.fromString(Cookie.get("lastRequestTime"));
        }
        if (Cookie.exists("weather")) {
            weather = Json.parse(Cookie.get("weather"));
        }
        Browser.navigator.geolocation.getCurrentPosition(positionCallback);
    }

    public static function positionCallback(pos) {
        var lat, long;
        lat = pos.coords.latitude;
        long = pos.coords.longitude;

        requestWeather(lat, long);
    }

    public static function requestWeather(lat, long) {
        var currentTime = Date.now();
        var timeSinceLastRequest = currentTime.getMinutes() - lastRequestTime.getMinutes();
        if (timeSinceLastRequest < 10) {
            // don't want to make too many requests
            var timeToWait = 10 - timeSinceLastRequest;
            Browser.console.log('Please wait $timeToWait minutes for new weather.');

            Browser.window.setTimeout(requestWeather, (timeToWait * 60 * 10000) + 1);

            parseWeather(weather);
            return;
        } else {
            Browser.console.log("Getting weather...");
        }
        // Add code to limit calls
        Helpers.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather",
            options: [
            "id"        => "524901",
            "APPID"     => "06d6414fcf6bc783d1f3249c2a44fa81",
            "lat"       => Std.string(lat),
            "long"      => Std.string(long),
            "callback"  => "Main.weatherCallback"
            ]
        });

        lastRequestTime = currentTime;
        Cookie.set("lastRequestTime", lastRequestTime.toString());
    }

    public static function weatherCallback(response) {
        weather = response;
        Cookie.set("weather", Json.stringify(response));
        parseWeather(response);
    }

    public static function parseWeather(weather) {
        if (weather == null) {
            Browser.console.log("Weather is null - wait for response.");
            return;
        }
        Helpers.getEl("location").innerHTML = '${weather.name}, ${weather.sys.country}';
        Helpers.getEl("temperature").innerHTML = weather.main.temp;
        Helpers.getEl("description").innerHTML = weather.weather[0].description;
        Helpers.getEl("icon").setAttribute("src", 'http://openweathermap.org/img/w/${weather.weather[0].icon}.png');
    }
}
