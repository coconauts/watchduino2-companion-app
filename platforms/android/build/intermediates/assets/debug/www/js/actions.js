var sendTwitterTimeline = function(){
  twitter.homeTimeline(function(timeline) {
      log(TAG, "Timeline " +JSON.stringify(timeline) );
  });
};

var sendTime = function(){
  var date = new Date();
  var seconds = date.getTime() / 1000;
  var secondsUTC = seconds - (date.getTimezoneOffset() * 60);
  bt.send("!tm:"+parseInt(secondsUTC) );
};

var changeStatus = function(message, status){

  if (settings.notification) notification.watchduinoStatus(status);
  drawChat("info", status);

  $("#status-bar").removeClass().addClass("row " +status);
  $("#bt-status").html(message);
};

var cachedTflStops = [];
var sendTflStops = function(position){

  if (position && cachedTflStops.length > position) {
    log("Controls", "Loading TFL stop " + position );
    sendTflArrival(cachedTflStops[position]);
  } else searchTflStops();
};

var searchTflStops = function(){
  geolocationService.getLocation(function(error, latlon) {
    if (error) {
      console.error("Controls", "#search-button", "Unable to get location", error);
      log("Unable to get location " + JSON.stringify(error) );
      return;
    }

    log("Controls","Searching TFL in " + latlon.lat + ","+latlon.lon);
    tfl.stopPoints(latlon.lat, latlon.lon, function(error, json){
      if (error) log("Controls", "Unable to get TFL stops " + error);

      drawChat("info", "Got " + json.stopPoints.length + " stops from TFL");

      cachedTflStops = json.stopPoints;
      //log("Controls", "TFL stops " + JSON.stringify(cachedTflStops));

      //for (var i = 0; i < json.stopPoints.length; i++){
      if (cachedTflStops.length > 0){
        sendTflArrival(cachedTflStops[0]);
      }
    });
  });
};

var sendTflArrival = function(stop){
  tfl.arrivals(stop.naptanId, function(error, json) {
    if (error) log(TAG, "Unable to send TFLArrival "+error, "error");
    //log("Controls", "Got " + json.length + " arrivals from TFL");
    var msg = "Stop " + stop.stopLetter + "\n";
    var now = new Date().getTime();
    for (var i = 0; i < json.length && i < 3; i++){
      var arrival = json[i];
      //var msg = "Line " + arrival.lineId + " will arrive at " + arrival.expectedArrival + " at stop " +  arrival.stationName + "("+ arrival.platformName+")";
      var timeArrival = tfl.minutesToArrival(arrival.expectedArrival);
      msg += arrival.lineId+ ": "+ timeArrival +" m\n";
      log("Controls", msg);
    }
    bt.send("!tf:"+msg);
  });
};

var sendForecast = function(){
  log(TAG, "Sending forecast");

  geolocationService.getLocation(function(error, latlon) {
    if (error) {
      console.error("Controls", "#search-button", "Unable to get location", error);
      log("Controls", "Unable to get location " + JSON.stringify(error) , "error");
      return;
    }

    log("Controls", "Searching forecast in " + latlon.lat + ","+latlon.lon);
    forecast.forecast(latlon.lat, latlon.lon, function(error, json){
      var c = json.currently;
      var celsius = c.temperature-32;
      var temp =  parseInt(celsius);//Math.round(celsius * 100) / 100;
      var msg = c.summary + " "+ temp + " degrees";
      log("Controls", "Got forecast: "+msg);
      bt.send("!wt:"+msg);
    });
  });
};

var notificationStatus = function(enabled){

    $("#send-notif-enable").prop('disabled',enabled);
    $("#send-notif-trigger").prop('disabled',!enabled);
    $("#send-notif-cancel").prop('disabled',!enabled);
};
