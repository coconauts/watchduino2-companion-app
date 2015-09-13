var TAG = "Receive";

var onReceive = function(msg){
  drawChat("receive", msg);

  if (msg.contains("!")){
    var command = msg.trim().substring(1, 3);
    var value = msg.trim().substring(5);
    processCommand(command, value);
  } else {
    log(TAG, "Unrecognized message: "+msg, "error");
  }
}

var processCommand = function (command, value) {
  log(TAG, "Command " +command + " value " + value);
  switch(command) {
    case "tm":
        sendTime();
        break;
    case "wt":
        sendForecast();
        break;
    case "tf":
          sendTflStops();
          break;
    case "bt":
          log(TAG, "Battery notification "+value);
          break;
    default:
      log(TAG, "Unrecognized command: "+command, "error");
    }
}
