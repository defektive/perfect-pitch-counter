#! /bin/bash

npx expo prebuild --platform android
sed -i '/enableBundleCompression/d' android/app/build.gradle
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ANDROID_HOME=~/Android/Sdk ./android/gradlew -p ./android assembleDebug