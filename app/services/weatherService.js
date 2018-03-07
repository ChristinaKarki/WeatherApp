app.factory('weatherService', function($http) {
    var urlFirstPart = "http://api.openweathermap.org/data/2.5/weather?q=";
    var urlLastPart = "&type=accurate&units=imperial&mode=json&APPID=db810d47603ab4d59f650c69835e4659";
    var getCurrentWeather = function(city){
        return $http.get(urlFirstPart + city + urlLastPart,{cache: true});
        //return $http.get(urlFirstPart + city + urlLastPart);
    };

    var getLocalDateAndTimeBasedOnLocation = function(apiCall){
        return $http.get(apiCall, {cache: true});
        //return $http.get(apiCall);
    };

    return{
        getCurrentWeather: getCurrentWeather,
        getLocalDateAndTimeBasedOnLocation: getLocalDateAndTimeBasedOnLocation
    }
});
