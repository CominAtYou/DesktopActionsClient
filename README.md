# Desktop Actions Client
![Build Status](https://github.com/CominAtYou/DesktopActionsClient/actions/workflows/build.yml/badge.svg)

The desktop client for Desktop Actions, allowing you to remotely power off, lock, or put your computer to sleep, all from your (Android) phone.
![Screenshot](https://i.imgur.com/hdAqOHV.png)
## Features
- Gives you the ability to remotely lock, shut down, and sleep your computer, all from your phone
- Notifications to alert you when a shut down or sleep has been requested, and the ability to cancel it with one click.
- A settings page
## Important Stuff
Do note that this is exclusive to Android and Windows. I don't have a Mac (yet) so I can't create a client for macOS. An iOS app is out of the question since trying to install anything outside of the App Store is literal witchcraft. Linux support is coming down the road.

**This was designed for and will work with Windows 10. For earlier versions of Windows, a version with Windows Powershell is required.** They should work as well as if it were running on Windows 10, but YMMV when it comes to notifications.
## Getting Set Up
1. Download latest version from the [releases](https://github.com/CominAtYou/DesktopActionsClient/releases/latest) page.
2. Open the app, and customize the settings to your liking, or stick with the preset, randomly-generated values.
3. Fill out the settings on your mobile app.
## Building
1. `tsc`
2. `npm run build`
3. ???
4. Profit
## Creating The Installer
You'll need to build first before doing this.

Creating the installer is simple enough. Just tweak the values in [winstaller.js](https://github.com/CominAtYou/DesktopActionsClient/blob/master/winstaller.js) to your liking, then run `node winstaller.js`. Once complete, the Squirrel installer and .msi will be in `./bin/installers`.
