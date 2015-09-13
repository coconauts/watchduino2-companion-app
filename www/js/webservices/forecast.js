var forecast = new Forecast();

function Forecast(){
  //Documentation https://developer.forecast.io/docs/v2
  var key = config.weather.forecastio_api_key
  var domain = "https://api.forecast.io"

  //https://api.forecast.io/forecast/42eeb6f75c2206cc5fad3a43683919ce/51.537252,-0.119523
  this.forecast = function(lat, lon, callback){

      if (!isCordova()){
        $.getJSON("samples/forecast.json", function(json) {
          console.log("Forecast: fake success", json);
          callback(undefined, json);
        });
        return;
      }
      var url = domain +"/forecast/"+key+"/"+lat+","+lon

      $.ajax({
        url: url,
        crossDomain:true,
        success: function(json){
          callback(false, json);
        },
        error: function(xhr){
          console.error("Forecast: Unable to get forecast "+url, xhr);
          callback(xhr);
        }
      });

  }
}
