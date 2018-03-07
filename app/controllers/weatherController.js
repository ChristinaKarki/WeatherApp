app.controller("weatherController", function($scope, weatherService) {
    $scope.cityIsEntered = false;
    $scope.cityInputChange = function() {
        $scope.cityIsEntered = false;
    };

    var getBeijingCurrentWeatherPromise = weatherService.getCurrentWeather("Beijing,CN");
    getBeijingCurrentWeatherPromise.then(function(response){
        $scope.beijingWeatherData = response.data;
        var weatherIcon = $scope.beijingWeatherData.weather[0].icon;
        $scope.beijingWeatherImageSrc = "http://openweathermap.org/img/w/"+weatherIcon+".png";
        var latitude = $scope.beijingWeatherData.coord.lat;
        var longitude = $scope.beijingWeatherData.coord.lon;
        var location = latitude +", "+ longitude;
        currentlocaltime('beijingTime', location);
        getSunriseSunsetTime(location, $scope.beijingWeatherData);
    },function(response){
        console.log("Get Beijing current weather service failed.", response.statusText);
    });

    var getNewYorkCurrentWeatherPromise = weatherService.getCurrentWeather("New York,US");
    getNewYorkCurrentWeatherPromise.then(function(response){
        $scope.newYorkWeatherData = response.data;
        var weatherIcon = $scope.newYorkWeatherData.weather[0].icon;
        $scope.nyWeatherImageSrc = "http://openweathermap.org/img/w/"+weatherIcon+".png";
        var latitude = $scope.newYorkWeatherData.coord.lat;
        var longitude = $scope.newYorkWeatherData.coord.lon;
        var location = latitude +", "+ longitude;
        currentlocaltime('newYorktime', location);
        getSunriseSunsetTime(location, $scope.newYorkWeatherData);
    },function(response){
        console.log("Get New York current weather service failed.", response.statusText);
    });

    var getBrusselsCurrentWeatherPromise = weatherService.getCurrentWeather("Brussels,BE");
    getBrusselsCurrentWeatherPromise.then(function(response){
        $scope.brusselsWeatherData = response.data;
        var weatherIcon = $scope.brusselsWeatherData.weather[0].icon;
        $scope.brusselsWeatherImageSrc = "http://openweathermap.org/img/w/"+weatherIcon+".png";
        var latitude = $scope.brusselsWeatherData.coord.lat;
        var longitude = $scope.brusselsWeatherData.coord.lon;
        var location = latitude +", "+ longitude;
        currentlocaltime('brusselsTime', location);
        getSunriseSunsetTime(location, $scope.brusselsWeatherData);
    },function(response){
        console.log("Get Brussels current weather service failed.", response.statusText);
    });

    $scope.showWeather = function(city){
        var currentWeatherPromise = weatherService.getCurrentWeather(city);
        currentWeatherPromise.then(function(response){
            $scope.cityIsEntered = true;
            $scope.weatherData = response.data;
            var imageIcon = $scope.weatherData.weather[0].icon;
            $scope.weatherImageSrc = "http://openweathermap.org/img/w/"+imageIcon+".png";
            var latitude = $scope.weatherData.coord.lat;
            var longitude = $scope.weatherData.coord.lon;
            var location = latitude +", "+ longitude;
            currentlocaltime('selectedCityTime', location);
            getSunriseSunsetTime(location, $scope.weatherData);
        }, function(response) {
            console.log("Current weather service call failed. ", response.statusText)
        });
    }

    function getSunriseSunsetTime(loc, weatherData){
        //weatherData.sys.sunrise time is used for timestamp, coz this is just to find the offset for specific cities and countries, it
        //doesn't matter whether you use weatherData.sys.sunrise or weatherData.sys.sunset
        var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + weatherData.sys.sunrise + '&key=' + apikey;
        var getLocalDateAndTimeBasedOnLocationPromise = weatherService.getLocalDateAndTimeBasedOnLocation(apicall);
        getLocalDateAndTimeBasedOnLocationPromise.then(function(response){
            var sunriseDate = new Date(0);
            var sunsetDate = new Date(0);
            var currentDate = new Date();
            sunriseDate.setUTCSeconds(weatherData.sys.sunrise);
            sunsetDate.setUTCSeconds(weatherData.sys.sunset);
            // get DST and time zone offsets in milliseconds
            var offsets = response.data.dstOffset * 1000 + response.data.rawOffset * 1000 + currentDate.getTimezoneOffset()*60*1000;
            console.log("ny offsets", offsets);

            // Date object containing current time of target location
          //  var sunrise = sunsetDate.getUTCMilliseconds() + offsets;
          weatherData.sys.sunriseTime = new Date(new Date(sunriseDate).getTime()  + new Date(offsets).getTime());
          weatherData.sys.sunsetTime = new Date(new Date(sunsetDate).getTime()  + new Date(offsets).getTime());
         //   weatherData.sys.sunriseTime = new Date(new Date(sunriseDate).getTime()  + offsets);
        //   weatherData.sys.sunsetTime = new Date(new Date(sunsetDate).getTime()  + offsets);
        },function(response){
            console.log("Google API call failed");
        });
    };

    var targetDate = new Date();
    // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
    var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60;
    // you have to get the key to use this api
    var apikey = 'AIzaSyDUCjx8kA3zBKCbmGLfI4DyvvWPrKI68E8';
    var daysofweek=new Array(7);
    daysofweek[0]="Mon";
    daysofweek[1]="Tues";
    daysofweek[2]="Wed";
    daysofweek[3]="Thurs";
    daysofweek[4]="Fri";
    daysofweek[5]="Sat";
    daysofweek[6]="Sun";

    function currentlocaltime(divId, loc){
        var container = document.getElementById(divId);
        var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + apikey;
        var getLocalDateAndTimeBasedOnLocationPromise = weatherService.getLocalDateAndTimeBasedOnLocation(apicall);
        getLocalDateAndTimeBasedOnLocationPromise.then(function(response){
                var offsets = response.data.dstOffset * 1000 + response.data.rawOffset * 1000; // get DST and time zone offsets in milliseconds
                var localdate = new Date(timestamp * 1000 + offsets); // Date object containing current time of target location
                var refreshDate = new Date(); // get current date again to calculate time elapsed between targetDate and now
                var millisecondselapsed = refreshDate - targetDate; // get amount of time elapsed between targetDate and now
                localdate.setMilliseconds(localdate.getMilliseconds()+ millisecondselapsed); // update localdate to account for any time elapsed

                if(divId === "beijingTime"){
                    $scope.beLocalDate = localdate;
                }
                else if(divId === "newYorktime"){
                    $scope.nyLocalDate = localdate;
                }else if(divId === "brusselsTime"){
                    $scope.brLocalDate = localdate;
                }else if(divId === "selectedCityTime"){
                    $scope.localDate = localdate;
                }

                setInterval(function(){
                    localdate.setSeconds(localdate.getSeconds()+1);
                    container.innerHTML = localdate.toLocaleTimeString() + ' (' + daysofweek[ localdate.getDay() ] + ')';
                }, 1000)
            },function(response){
                console.log("Google API call failed");
            });
    };
});
