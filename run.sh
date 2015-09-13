#!/bin/bash
cordova platform add android

cordova plugin remove net.coconauts.notification-listener
cordova plugin add net.coconauts.notification-listener/

cordova run android --device

$ANDROID_HOME/platform-tools/adb logcat  -T 1 | grep "CONSOLE\|NotificationService\|Notification"
