---
name: run-on-device
description: Use when running the GlowUp app locally on a USB-connected Android or iOS device for development and testing.
---

# Run GlowUp on a USB Device

## Overview

Local dev builds run directly on a physical device via USB — faster iteration than EAS, no cloud build needed. Android is the primary target.

## Prerequisites

| Requirement | Path / Command |
|-------------|---------------|
| Android SDK | `~/Library/Android/sdk` |
| adb | `~/Library/Android/sdk/platform-tools/adb` |
| Android native folder | `android/` exists in project root (no prebuild needed) |

Add adb to PATH for this session if needed:
```bash
export PATH="$PATH:/Users/rahul/Library/Android/sdk/platform-tools"
```

## Connect Android Device

1. On phone → **Settings → About phone** → tap **Build number** 7× (enables Developer Options)
2. **Settings → Developer Options → USB debugging** → ON
3. Plug in via USB → tap **Allow** on the phone popup
4. Verify:
```bash
/Users/rahul/Library/Android/sdk/platform-tools/adb devices
# Should show: <serial>  device
# "unauthorized" means tap Allow on phone again
```

## Run the App

```bash
cd /Users/rahul/projects/glowup
npx expo run:android
```

- First build: ~3-5 min (Gradle cold start)
- Subsequent builds: ~30-60 sec
- App installs and launches automatically on device

## iOS (USB)

```bash
npx expo run:ios --device
```
Requires Xcode + Apple Developer account signed into Xcode. Select device from picker.

## Common Issues

| Symptom | Fix |
|---------|-----|
| `adb devices` shows nothing | Re-plug USB, tap Allow on phone, toggle USB debugging off/on |
| `adb devices` shows `unauthorized` | Tap "Allow" on the USB debugging popup on the phone |
| `No devices found` in Expo | Run `adb devices` first to confirm device is visible |
| Build fails — SDK version | Check `android/local.properties` has `sdk.dir=/Users/rahul/Library/Android/sdk` |
| Metro bundler port conflict | Kill existing Metro: `lsof -ti:8081 \| xargs kill` |
| App crashes on launch | Check `.env` has `EXPO_PUBLIC_GEMINI_API_KEY` set |

## Dev Tips

- Hot reload is active by default — save a file and the app updates instantly
- Shake device to open Expo Dev Menu (reload, inspector, etc.)
- Logs stream to the terminal running `expo run:android`
- To just start Metro without rebuilding: `npx expo start --android`
