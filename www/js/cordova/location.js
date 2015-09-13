var geolocationService = new Location();

function Location(){

  var useFake = false;

  this.getLocation = function (callback){

    if (useFake) {
      var latlon = {
        "lat": 51.537068,
        "lon": -0.119114
      };
      callback(undefined, latlon);
    } else if (isCordova()) getCordovaLocation(callback);
    else getBrowserLocation(callback);
  }

  var getCordovaLocation = function (callback) {
    //log("getCordovaLocation ");

    var onSuccess = function(position) {
        console.log("CordovaLocation" + JSON.stringify(position) );
        var latlon = {
          "lat": position.coords.latitude,
          "lon": position.coords.longitude
        };
        callback(undefined, latlon);
    };

    var onError = function (error) {
      console.log("CordovaLocation", "Unable to get geolocation", error);
      callback(error);
    }
    geolocation.getCurrentPosition(onSuccess, onError, {maximumAge:Infinity, timeout:10000, enableHighAccuracy:true});
    //TODO CHeck if phone settings in android is set to (device-only) wich means it doesn't have access to geolocation
  }


  var getBrowserLocation = function (callback) {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
            console.log("-", "getLocation", position);
              var latlon = {
                "lat": position.coords.latitude,
                "lon": position.coords.longitude
              };
              callback(undefined, latlon);
          });
      } else {
          var error = "Geolocation is not supported by this browser";
          console.error("-", "getLocation", "Unable to get location", error);
          callback(error);
      }
  }
}
