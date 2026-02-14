# Clerotri

<div style="display: flex; align-items: center;">
  <a href="https://accrescent.app/app/app.upryzing.clerotri">
    <img alt="Get it on Accrescent" src="https://accrescent.app/badges/get-it-on.png" height="80">
  </a>
  <a href="https://apt.izzysoft.de/fdroid/index/apk/app.upryzing.clerotri">
    <img alt="Get it on IzzyOnDroid" src="https://gitlab.com/IzzyOnDroid/repo/-/raw/master/assets/IzzyOnDroid.png" height="80">
  </a>
</div>

<div style="flex-direction: row;">
  <a href="https://rexowo.dev/donate/">
    <img src="https://img.shields.io/badge/donations-appreciated-mediumvioletred" alt="Donations badge from shields.io" />
  </a>
  <a href="https://translate.upryzing.app/engage/clerotri/">
    <img src="https://translate.upryzing.app/widgets/clerotri/-/app/svg-badge.svg" alt="Translation status on Weblate" />
  </a>
  <a href="https://lea.pet/@clerotri">
    <img src="https://img.shields.io/badge/fedi-@clerotri@lea.pet-teal" alt="Fediverse badge from shields.io"/>
  </a>
  <a href="https://bsky.app/profile/clerotri.upryzing.app">
    <img src="https://img.shields.io/badge/bluesky-@clerotri.upryzing.app-dodgerblue" alt="Fediverse badge from shields.io"/>
  </a>
  <a href="https://shields.rbtlog.dev/app.upryzing.clerotri">
    <img src="https://shields.rbtlog.dev/simple/app.upryzing.clerotri" alt="RB shield">
  </a>
</div>

**Clerotri** is an Upryzing and Revolt/Stoat client made with React Native. It is currently available for Android and will be available for web in the future.

**Please note that Clerotri is currently in beta.** It may contain bugs and incomplete features - use at your own discretion.

For development updates and other news, join [Clerotri's support server][support-server].

## Installing

If you want to install Clerotri for Android, you can either:

- download the app via [Accrescent](https://accrescent.app/app/app.upryzing.clerotri) or [IzzyOnDroid](https://apt.izzysoft.de/fdroid/index/apk/app.upryzing.clerotri) (using one of these is recommended), or
- go to [the releases tab](https://github.com/upryzing/clerotri/releases) and download the latest version.

<!-- You can try Clerotri for web [here](). Note that, as the web version is still under development, some features are only available on Android or may not work as smoothly. You may also see some layout issues. -->

Release builds are also produced for every commit. These may contain bugs, but you can try out new features early.

### Info about split builds

Also note that, from v0.7.0, Clerotri's APKs are **split by architecture**. This helps to reduce file and app sizes - however, you'll need to make sure that you **download the APK that matches your device's architecture**, or **it won't install!**

**If you're using an app store, this should be handled for you.**

If not, however, you'll need to check your device's architecture. I'd recommend using [Treble Info](https://gitlab.com/TrebleInfo/TrebleInfo/-/blob/dev/README.md) for this.

Install and open the app - **don't worry about what it says on the home page!** - then open the Details tab and check the CPU architecture entry. Depending on what it says:

- if it says `ARM64`, you'll want the APK with **`arm64-v8a`** in its file name;
- if it says `ARM32`, you'll want the APK with **`armeabi-v7a`** in its file name;
- if it says `x86_64`, you'll want the APK with **`x86_64`** in its file name;
- and if it says `x86`, you'll want the APK with **`x86` but without `64`** in its file name.

If it says `Unknown`, please ask for help in [our support server][support-server].

## Building

See [the building guide][building].

## Troubleshooting

If you encounter bugs, first check if you're able to [open Stoat in your browser](https://old.stoat.chat); also, check if you have any firewall settings that may block the Stoat API.

If you're still experiencing issues, and there aren't any open issues for the bug(s) you're facing, please [open an issue](https://github.com/upryzing/clerotri/issues).

## License

Clerotri is licensed under the [GNU Affero General Public License v3.0](https://github.com/upryzing/clerotri/blob/main/LICENSE).

[support-server]: https://rvlt.gg/clerotri
[building]: ./docs/dev/building.md
