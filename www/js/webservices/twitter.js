//Requires oauth-phonegap
//https://github.com/oauth-io/oauth-phonegap

//Twitter API Documentation
//https://dev.twitter.com/rest/reference/get/statuses/home_timeline

var twitter = new Twitter();

function Twitter() {

  var domain = "https://api.twitter.com/1.1";
  var app = "twitter";

  this.initialize = function() {
    console.log("Initializing Twitter OAUTH authentication");
    OAuth.initialize(config.twitter.oauthio_key);
    console.log("initializing with "+config.twitter.oauthio_key);
  }

  this.homeTimeline = function(callback){

    OAuth.popup(app, {cache: true})
    .done(function(result) {
        result.get(domain+"/statuses/home_timeline.json")
        .done(function (response) {
            console.log("Success timeline: ",response);
            callback(response);
        })
        .fail(function (err) {
            console.error("Error getting timeline "+ err);
        });
    })
    .fail(function (err) {
          console.error("Error authentication",err);
    });

  }

  this.tweet = function(status){

    OAuth.popup(app, {cache: true})
    .done(function(result) {
        result.post(domain+"/statuses/update.json", {
            data: {
                status: status
            }
        })
        .done(function (response) {
            console.log(response);
            callback(response);
        })
        .fail(function (err) {
            console.error(err);
        });
    })
    .fail(function (err) {
          console.error(err);
    });

  }
}
