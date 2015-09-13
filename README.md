# WatchDuino phone companion app

This is a companion app to be used with a
[WatchDuino 2 smartwatch](https://github.com/coconauts/watchduino2).

It allows Bluetooth pairing of the phone and the WatchDuino device,
so notifications can flow between the two.

At present the companion app includes a background service, and a
debugging interface that you can use to trigger and inspect messages
between the devices.

The companion app is written on top of the
[Apache Cordova framework](https://cordova.apache.org/).

This project is currently a work in progress in a very alpha state, so expect drastic changes without warning.

## Install on Android

We have got no distributable builds at the moment, so the only way to
install it is to build it yourself. Refer to the
[building from source document](docs/build.md) for instructions.

## Install on iOS?

Currently not possible, sorry!

## Development resources

### Plugins

* Toast: cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
* Notification: cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications.git
* Geolocation: cordova plugin add cordova-plugin-geolocation
* BLE: cordova plugin add com.megster.cordova.ble
* OAUTH: cordova plugin add https://github.com/oauth-io/oauth-phonegap

### References

* [Apache Cordova cli](https://cordova.apache.org/docs/en/5.1.1/guide_cli_index.md.html#The%20Command-Line%20Interface)
* [Apache Cordova API](https://cordova.apache.org/docs/en/5.1.1/cordova_plugins_pluginapis.md.html#Plugin%20APIs)
* [Materialize CSS](http://materializecss.com/)
* [BLE plugin Github](https://github.com/don/cordova-plugin-ble-central)
* [BLE examples](https://github.com/don/cordova-plugin-ble-central/tree/master/examples)
* [Cordova notification plugin](https://github.com/katzer/cordova-plugin-local-notifications)
* [Background mode](https://github.com/katzer/cordova-plugin-background-mode)
