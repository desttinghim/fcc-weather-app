import js.Browser;

class Main {
    public static var lastRequestTime = 0;

    public static function main() {
        Browser.navigator.geolocation.getCurrentPosition(positionCallback);
    }

    public static function positionCallback(pos) {
        var lat, long;
        lat = pos.coords.latitude;
        long = pos.coords.longitude;

        requestWeather(lat, long);
    }

    public static function requestWeather(lat, long) {
        // var currentTime = Browser.
        // Add code to limit calls
        Helpers.ajax({
            url: "api.openweathermap.org/data/2.5/weather",
            options: [
            "lat"    => Std.string(lat),
            "long"   => Std.string(long),
            "callback"  => "Main.weatherCallback"
            ]
        });
    }

    public static function weatherCallback(response) {
        trace(response.main.temp);
    }
}
