var tfl = new Tfl();

function Tfl(){
  //Documentation https://developer.forecast.io/docs/v2
  var appId = config.tfl.app_id;
  var appKey = config.tfl.app_key;
  var domain  = "http://api.tfl.gov.uk";

  //http://api.tfl.gov.uk/StopPoint?lat=51.535844&lon=-0.122287&stopTypes=NaptanPublicBusCoachTram&radius=200&app_id=02a852ee&app_key=1b9b23a307d3412d4ac629928fb4b811
  this.stopPoints= function(lat, lon, callback){

    if (!isCordova()){
      $.getJSON("samples/tfl-stops.json", function(json) {
        console.log("TFL: stops fake success", json);
        callback(undefined, json);
      });
      return;
    }
      var radius = 200;
      var stopType = "NaptanPublicBusCoachTram";
      var url = domain +"/StopPoint";

      $.ajax({
        url: url,
        data: {
          lat: lat,
          lon: lon,
          stopTypes: stopType,
          radius:radius,
          app_id: appId,
          app_key: appKey
        },
        success: function(json){
          callback(false, json);
        },
        error: function(xhr){
          console.error("TFL: Unable to get stopPoints "+url, xhr);
          callback(xhr);
        }
      });
  }
  //http://api.tfl.gov.uk/StopPoint/490019520D/Arrivals
  this.arrivals= function(stopId, callback){

    if (!isCordova()){
      $.getJSON("samples/tfl-arrivals.json", function(json) {
        console.log("TFL: arrivals fake success", json);
        callback(undefined, json);
      });
      return;
    }
      var url = domain +"/StopPoint/"+stopId+"/Arrivals";

      $.ajax({
        url: url,
        success: function(json){
          callback(false, json);
        },
        error: function(xhr){
          console.error("TFL: Unable to get arrival: "+url, xhr);
          callback(xhr);
        }
      });
  }

  this.minutesToArrival = function(arrival) {
    var now = new Date().getTime();
    var time = new Date(arrival).getTime();

    var seconds = (time - now)/1000;
    if (seconds < 60) {
      return "<1";
    } else {
      var min = seconds / 60;
      return Math.round(min * 100) / 100;
    }
  }
}
