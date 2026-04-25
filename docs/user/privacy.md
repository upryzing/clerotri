# Privacy information

_This was last updated on xx/04/2026._

_For the purposes of this document, "we" and "us" refers to the core maintainers of Clerotri. As of the date of writing, this only includes me ([Rexogamer](https://rexowo.dev))._

By default, Clerotri doesn't collect any data itself. You can optionally enable [analytics](#analytics) to help improve the app, but these are **strictly optional** and disabling them will **not affect app functionality**. You can also choose to enable extra user badges.

## Regular data

Your messages, attachments and other data you send via the app will - hopefully unsurprisingly - be sent to the Upryzing/Stoat/Revolt instance you're using. By default, the app connects to [`stoat.chat`](https://stoat.chat).

As Clerotri is a third-party client, we don't store or control this data, so please refer to the privacy and data policies of the instance(s) you're using.

### Data deletion

Clerotri doesn't currently support account deletion, though this is planned for a future update.

- If you're using `stoat.chat` (the default instance), see their account deletion guide [here](https://support.stoat.chat/kb/account/deleting-your-account), or their partial data deletion guide [here](https://support.stoat.chat/kb/account/partial-deletion-pii). Note that the steps for Android refer to [the official Android app](https://github.com/stoatchat/for-android).
- If you're using another instance, please contact the instance's operators for more information.

## Analytics

Analytics are disabled by default. If you choose to enable them, Clerotri will collect some basic data about your device and your usage of Clerotri.

You will be asked if you wish to enable them upon launching the app for the first time, or (if you're updating from a version before v0.11.0) after updating the app. You can also enable, adjust or disable them at any time by opening the settings menu and selecting "Analytics".

Analytics are sent each time you open the app and are split into two tiers.

### Basic tier

If you enable the basic tier of analytics, Clerotri will collect:

- your phone's model (e.g. `google/panther` for a Google Pixel 7),
- your operating system and its version (e.g. `Android (API 36)` for Android 16), and
- the version of Clerotri you're using (e.g. `v0.11.0`).

This lets us see what devices and operating systems are being used, which is useful for determining what to focus on supporting - for example, if nobody's using an older version of Android, we can safely drop support for it.

### Full tier

If you enable the full tier of analytics, Clerotri will collect:

- everything listed in the Basic tier,
- your settings and their values (e.g. your theme and the features you enable/disable), and
- your instance's API URL (e.g. `https://api.stoat.chat`).

This lets us see what settings are being used and how, and which instances are being used - for example, if a setting is unused we can more safely drop it, and if a lot of users are using a specific instance we can consider extra support for it and any extra features or changes it may have.

## Extra badges

Extra badges - including donor badges - are also disabled by default. If you choose to enable them, the version of Clerotri you're using and your current instance's API URL will be sent to us to provide the correct list of users with extra badges.

You will be asked if you wish to enable them upon opening a user profile for the first time. You can also enable or disable them at any time by opening the settings menu and selecting "Privacy".

The amount of data stored depends on your analytics settings:

- if analytics are disabled, the app version and the URL will be discarded after generating the list of users;
- if you've enabled the basic tier of analytics, the app version will be stored; and
- if you've enabled the full tier of analytics, the app version _and_ the URL will be stored.

The total amount of requests for extra badge lists is also stored.

Stored data is used for easier troubleshooting and analysis.

## Retention and access

Analytics and information about badge list requests are stored for up to 365 days. General statistics (e.g. the amount of people using a specific setting or Android version) may be made public, while the specific data is only accessible to the core contributors as listed above.

## Deletion

As there's no way for us to tie sets of data together, **data deletion is not possible**. However, the fact that we can't tie this data together means your privacy is enhanced - we can't identify who a specific set of analytics or badge list requests belongs to.

## Contact us

If you have any further questions or suggestions, feel free to [open an issue](https://github.com/upryzing/clerotri/issues/new) or ask in [Clerotri's Stoat server](https://rvlt.gg/clerotri)
