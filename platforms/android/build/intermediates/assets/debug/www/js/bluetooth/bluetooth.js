
function Bluetooth(bluetooth){

  var TAG = "Bluetooth";
  var CONNECTED= "connected", DISCONNECTED= "disconnected";

  var MAX_MSG_SIZE = 10;

  var device = {
    //id:"B4:99:4C:51:C0:51" //assembled watchduino
    id:"78:A5:04:3E:CD:B6" //Prototype board

  /*  service: "ffe0",
    characteristic: "ffe1",
    peripheral: { name:"Wathduino",
      id:"B4:99:4C:51:C0:51",
      advertising:{},
      rssi:-66,
      services:["ffe0"],
      characteristics:[{service:"ffe0",characteristic:"ffe1",properties:["Read","WriteWithoutResponse","Notify"], descriptors:[{uuid:"2902"},{uuid:"2901"}] }]
    }*/
  };

  var messageQueue =[];
  var reconnect = false;
  var queueSystem = false; //Won't work on background

// ----------------
// PERIODIC FUNCTIONS (INTERVALS)
// ----------------
//Won't work on background

  setInterval( function(){
    //log(TAG, "Processing message queue " + messageQueue.length);
    if (messageQueue.length > 0 ){
      var firstMessage = messageQueue.shift();
      bt.sendNow(firstMessage);
    }
  }, 2000 );

    setInterval(function(){

        if (reconnect && device.status != CONNECTED && device.id){
          autoConnect(device.id);
        }
    }, 5000);

// ----------------
// PUBLIC FUNCTIONS
// ----------------
  this.setAutoreconnect = function(value) {
    log(TAG, "Reconnect set to  "+value);

    reconnect = value;
  };

  //Sample peripheral data https://github.com/don/cordova-plugin-ble-central#peripheral-data
  this.isConnected = function(){
    if (device.status === CONNECTED) bluetooth.isConnected(device.peripheral.id, onSuccess, onError);
    else log(TAG, "Device status is not connected");
  };
  this.isEnabled = function(){
    bluetooth.isEnabled(onSuccess, onError);
  };
  this.enable = function() {
    bluetooth.enable(onSuccess, onError);
  };

  this.send = function(msg){

    if(queueSystem){
      log(TAG, "Adding message to bluetooth queue: "+msg.replace(/\n/g, "\\n"));
      messageQueue.push(latin);
      log("Messages in queue ", messageQueue);
    } else this.sendNow(msg);
  };

  this.sendNow = function(msg){
    if (device.status === CONNECTED) {
      log(TAG, "Writing bluetooth: "+msg.replace(/\n/g, "\\n"));
      var endChar = "\r";
      var fullMsg =  msg.latinise() +endChar;

      drawChat("send", msg);

      if (fullMsg.length > MAX_MSG_SIZE) sendInParts(fullMsg);
      else {
          var bytes = stringToBytes(fullMsg);
          bluetooth.writeWithoutResponse(device.peripheral.id, device.service, device.characteristic, bytes, function(){}, onError);
      }
    } else {
      log(TAG, "Cannot send msg, Bluetooth device is not connected", "error");
    }
  };

  this.scan = function() {
    bluetooth.isEnabled(function(){
      log(TAG, "Scanning devices");
      bluetooth.stopScan(function(){

        bluetooth.scan([], 10, onScan, onError);
        //setStatus("Scanning devices... ");
        $("#list-devices").empty();
        $("#scan-loading").show();

        drawChat("info", "Scanning devices...");

        setTimeout(function(){
            $("#scan-loading").hide();
        }, 10000);

      },onError);

    }, function(){
      changeStatus("Bluetooth is not enabled", "disconnected");
    });
  };

// ----------------
// PRIVATE FUNCTIONS
// ----------------

// ----------------
// PRIVATE : connection
// ----------------

var onScan = function(peripheral) {
  log(TAG, "Scan found: " + JSON.stringify(peripheral));
  printScanDevice(peripheral);
};

var onConnect = function(peripheral) {
    //app.status("Connected to " + peripheral.id);
    $("#scan-loading").hide();

    log(TAG, "onConnect peripheral: " + JSON.stringify(peripheral));
    device.status = CONNECTED;

    changeStatus("Connected to " + peripheral.name, "connected");

    device.peripheral = peripheral;   //Sample peripheral data https://github.com/don/cordova-plugin-ble-central#peripheral-data
    //printConnectedDevice(peripheral);
    log(TAG, "onConnect device: " + JSON.stringify(device));

    autoNotifyCharacteristic(peripheral);
    $('#modal1').closeModal();
};

var autoNotifyCharacteristic = function(peripheral) {
  for (var i = 0; i < peripheral.characteristics.length; i++){
      var c = peripheral.characteristics[i];
      var p = c.properties;
      if (p.indexOf("Notify") >= 0){
        log(TAG, "Listening to "+peripheral.name+": "+c.service+ ", " + c.characteristic );

        device.service = c.service;
        device.characteristic = c.characteristic;

        bluetooth.notify(peripheral.id, c.service, c.characteristic, onData, onError);
        return;
      }
  }
  log(TAG, "Device "+peripheral.id +" "+ peripheral.name + " doesn't have property Notify", "error");
};

var onDisconnect = function(reason) {
    log(TAG, "onDisconnect reason: " + reason);
    device.status = DISCONNECTED;

    changeStatus("Disconnected: " + reason, "disconnected");
};

var autoConnect = function(id){

  log(TAG, "Auto connecting bluetooth " + id);

    bluetooth.stopScan(function(){
      bluetooth.scan([], 5, function(peripheral){
        if (peripheral.id == id){
          changeStatus("Connecting to "+ peripheral.name + ": " + peripheral.id, "connecting");
          bluetooth.connect(device.id, onConnect, onDisconnect);
        }
      }, onError);
  });
};

// ----------------
// PRIVATE : send messages
// ----------------

  var sendInParts = function(msg) {
    var part = msg.substring(0, MAX_MSG_SIZE);
    var nextMessage = msg.substring(MAX_MSG_SIZE);

    log(TAG, "Sending message part " + part + ", " + nextMessage);

    var bytes = stringToBytes(part);
    bluetooth.writeWithoutResponse(device.peripheral.id, device.service, device.characteristic, bytes, onSuccess, onError);

    if (nextMessage.length > 0 )
    setTimeout(function() { //TODO will this work on BG?
        sendInParts(nextMessage);
    }, 100);
  };

// ----------------
// PRIVATE : draw
// ----------------

  var printScanDevice =  function(peripheral) {
    var template = $('#device-template').html();
     Mustache.parse(template);
     var rendered = Mustache.render(template, {device: peripheral, title: JSON.stringify(peripheral)});

     var $item = $(rendered);
     $item.click(function(){
       changeStatus("Connecting to "+ peripheral.name + ": " + peripheral.id, "connecting");
       bluetooth.connect(peripheral.id, onConnect, onDisconnect);
     });
     $("#list-devices").append($item);
  };

  //@deprecated Use autoNotifyCharacteristic instead
  var printConnectedDevice=  function(peripheral) {
    var template = $('#characteristic-template').html();
     Mustache.parse(template);
     var rendered = Mustache.render(template, {device: peripheral, title: JSON.stringify(peripheral)});

     log(TAG, "rendered: " + rendered);

     var $items = $(rendered);
      $items.find(".characteristic").click(function(){
       var id = $(this).attr('id');
       var service = id.split('-')[0];
       var characteristic = id.split('-')[1];

       var dev = $(this).parents("ul");
       var deviceName = dev.attr('device-name');
       var deviceId = dev.attr('id');

       changeStatus("Connected to "+deviceName+ " ("+service + ", " + characteristic+")", "connected");

       device.id = deviceId;
       device.service = service;
       device.characteristic = characteristic;

       bluetooth.notify(deviceId, service, characteristic, onData, onError);

         $('#modal1').closeModal();
     });
     $("#list-devices").html($items);
  };

  var onData = function(buffer) {
      var data = bytesToString(buffer);
      log(TAG, "onData data: " + data);

      //See receive.js
      onReceive(data);
  };
  var onSuccess = function(response){
      log(TAG, "Successfully executed " + response);
  };
  var onError = function(reason) {
      log(TAG, "There was an error " + reason, "error");
  };

}
