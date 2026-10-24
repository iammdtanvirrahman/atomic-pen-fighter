# Atomic Pen Fighter — Android Studio project

This folder contains a native Android **WebView wrapper** for Pen Game 6.0. The original game engine bundle is kept intact; Android packages the web assets locally so Local/AI play does not need a web server.

## Open in Android Studio

1. Clone/download the repository and open **this `android/` folder** in Android Studio (not only the repository root).
2. Use **JDK 17** for Gradle.
3. Install Android SDK Platform 36 if prompted, then click **Sync Project with Gradle Files**.
4. Choose an emulator or USB-connected Android phone and press **Run**.
5. To create a debug APK, select **Build → Build APK(s)**. The APK output should be at `app/build/outputs/apk/debug/app-debug.apk`.

## Project layout

- `settings.gradle`, `build.gradle`, `gradle.properties`: Gradle project configuration.
- `app/src/main/AndroidManifest.xml`: permissions and launcher activity.
- `app/src/main/java/.../MainActivity.java`: secure local WebView, immersive gameplay window, fullscreen handling and JS console logs.
- `app/src/main/assets/www/`: packaged game HTML, CSS, JavaScript and icons.

## Notes

- The Android-specific HTML removes the browser/PWA install banner, since installing a native APK from inside a WebView is not appropriate.
- Multiplayer needs internet. Because the packaged page runs on Android's local app-assets origin, test the invite/share URL on a real device before relying on it.
- No real-device runtime test or signed release build has been performed in this change. Test Local, AI, Online, 2D/3D switching, camera controls, back/pause behavior and fullscreen before publishing.
