# Clerotri's changelog

## v0.11.1

_This version was released on 03/06/2025._

### Bug fixes

- The app should now actually send data to the analytics server.
  - In my defence, it worked in the debug build (because debug builds allow HTTP connections).

## v0.11.0

_This version was released on 03/06/2025._

### What's new

- Clerotri now includes **opt-in analytics**. These are **completely optional** and are **disabled by default**. These will help me to improve the app.
  - You can find out more about what data is collected and how it's stored in [the privacy information][privacy_info] document.

### Bug fixes

- Some colours in the report menu have been tweaked.
- The role colour picker no longer has unexpected black bars at the top and bottom.
- The scrollbar on the server list has been hidden, as it was unnecessary and looked weird.
- The app should now be [reproducible][rb_info].
- The app no longer asks for the `BIND_GET_INSTALL_REFERRER_SERVICE` permission.

[privacy_info]: https://github.com/upryzing/clerotri/blob/main/docs/user/privacy.md
[rb_info]: https://reproducible-builds.org/

## v0.10.0

_This version was released on 23/04/2025._

### What's new

- Clerotri now includes a **global channel switcher**! Tap the switcher icon in the bottom menu to easily find and switch between channels, groups and DMs.
  - More options (including filtering and a list of recently opened channels) are planned for the future.
- The **reporting menu** has been revamped and expanded. It now includes:
  - various new reporting reasons introduced after it was initially added,
  - descriptions for each reason,
  - the ability to see which reason you've selected, and
  - the ability to go back and select a different reason.
- You can now see a **preview of your profile** in the profile settings menu! See how your display name, avatar, banner and status look at a glance - and with one tap, you can also check your bio.
- Text inputs with buttons next to them have been redesigned, featuring a cleaner look and slightly more horizontal space for the input itself.
- Deprecated settings are now explicitly marked in the settings menu. Note that these settings will be removed in future updates.
- The message box is now slightly taller, which should make it easier to press.

### Bug fixes

- On Android, the login page now has proper insets at the top and bottom.
  - In addition, its inputs should have the correct styles and should no longer be covered by the keyboard.
- If you leave or delete a server and the currently open channel is in that server, it will now be closed automatically.
- The link to learn more about Revolt's various Markdown formatting options in the server settings menu now links to the correct support article.
- The setting to enable or disable push notifications now stops toggling if you deny to give Clerotri permission to send notifications.
  - You can re-enable it by granting the permission in the Settings app.
- The close button on the instance switcher settings menu now disappears after switching instances.
- This one's a tentative fix - while I didn't notice this locally (because of the way I had previously implemented the offset), I _think_ it would've been an issue on other devices? Either way, if it _was_ an issue, the message box _should_ no longer be misaligned while the keyboard is open.
- The flags for Latvian and Hungarian in the language list are no longer mixed up. Apologies for this!
  - (In my defence, they're both triband flags with a central white stripe and at least one red stripe... though I am slightly surprised I didn't notice this until Lenify let me know 💀)
  - Thankfully, I'm not aware of any _particular_ disputes between these two... though I guess it's only fitting that I mixed up the Baltics and the Balka-

## v0.9.1

_This version was released on 31/03/2025._

### Bug fixes

- The "Translate Clerotri" button in the settings menu now correctly links to Weblate.
- On Android, the settings menu should no longer cut off at the bottom for users of 3-button navigation.
- Several mentions of RVMob in other languages have been updated to mention Clerotri instead.

## v0.9.0

_This version was released on 25/03/2025._

### Important notes

- For translators, some important news: **we've moved to a new Weblate instance.** You can now translate Clerotri via [Upryzing's instance][weblate_upryzing].
- I now accept **donations!** You can donate to me via [Ko-fi][kofi] or [Liberapay][liberapay]. This will make it easier for me to spend time working on the app. Thank you so much for your support <3

### What's new

- Clerotri now lets you **edit server-wide role permissions!** This is a big step towards complete support for server settings, and the work here should make channel permission editing pretty easy to add in the future :3
  - You can now also edit role ranks.
- Clerotri now supports several new languages:
  - Spanish,
  - Portuguese,
  - Simplified Chinese,
  - Polish,
  - Filipino,
  - Latvian, and
  - Esperanto.
- You can now **add bots via Discover!** From moderation to music, plenty of bots are available for a variety of needs.
  - You can now also view server descriptions for servers on Discover.
- The settings menu now includes links for those who want to translate or donate.
- The login page now uses Open Sans, matching the rest of the app.
  - Inter will be re-introduced as a app-wide font option in a future update.
- The app info page has received some visual improvements.
  - The app icon now displays properly on web.
- The app should now adapt slightly better to wider screens.
- Clerotri now uses React Native 0.79, which includes (among other things) **edge to edge support** on Android! The navigation bar is no longer stuck as a singular shade of grey.
  - Some areas now use a slightly different background colour, including the status bar.

### Bug fixes

- The app no longer crashes when someone sends a HEIC file.
- The sign up button on the log in page no longer links to a non-existent page ([PR](https://github.com/upryzing/cleortri/pull/44)). Thanks [zmjohnso][gh_zmjohnso]!
- The attachment picker button is no longer pressable when you've selected 5 attachments, and should no longer appear if you can't send files in a channel.
- The role colour picker now closes when you press the global back button or swipe back on Android.

### Known issues

- Due to various crashes, bottom sheets have been disabled on web (again). They will be re-enabled once the cause of these crashes has been located and fixed.

[weblate_upryzing]: https://translate.upryzing.app/projects/clerotri
[kofi]: https://ko-fi.com/rexogamer
[liberapay]: https://en.liberapay.com/rexogamer
[gh_zmjohnso]: https://github.com/zmjohnso

## v0.8.0

_This version was released on 17/02/2025._

​### Important notes

- Clerotri is **now available via [Accrescent][accrescent]!** Once you've installed the Accrescent app, you can get Clerotri [here][accrescent_direct]. Note that Accrescent requires Android 10 or later. This is the recommended way to get the app, as it provides quick, automatic updates.
  - We plan on bringing Clerotri to F-Droid in some capacity in the future.

​### What's new

- Introducing a new **channel context menu**! You can now create invites, mark channels as read and delete them by long-pressing the channel in the channel list.
- In-app notifications are now enabled by default, and can now be enabled or disabled separately from push notifications.
- The server member list in the server settings menu should now be much faster.
- Various colours have been updated to follow your selected theme.
- Clerotri now uses React Native 0.77.

​### Bug fixes

- Custom instances should now work properly again.

## v0.7.1

_This version was released on 27/01/2025._

​### What's new

- In-app notifications now look better, with proper alignment and shadows.

​### Bug fixes

- Switching between themes will no longer cause the app to crash.
- Messages should no longer duplicate/appear in the wrong channels.

[accrescent]: https://accrescent.app
[accrescent_direct]: https://accrescent.app/app/app.upryzing.clerotri

## v0.7.0

_This version was released on 25/01/2025._

Please note that the changelog for this version is incomplete. It's been over a year since v0.6.0, and [with over 500 commits][commits] I can't bring myself to sift through everything right now. I might at some point - alternatively, community contributions are more than welcome :3

​### Important notes

- You might've noticed something different: **the app has a new name and icon!** RVMob is now known as **Clerotri**, inspired by the [_Clerodendrum trichotomum_][flower].
- **Breaking change:** the app's bundle identifier has changed to `app.upryzing.clerotri`, meaning that **this update will install as a new app**, your settings **won't migrate** and **you'll need to log back in**. I sincerely apologise for the inconvenience, but I swear this will be the last time for the foreseeable future that you'll need to do anything major when updating.
- **Breaking change:** the app now _actually_ requires Android 7. It was the listed minimum version for v0.6.0, but the minimum SDK was set to Android 5 - this has now been fixed. (This isn't really much of a breaking change, though - Android 5/6 were never _officially_ supported, and I doubt anyone was using RVMob on them... if it even worked :eye::eye:)
- Clerotri is **now on the Fediverse!** I'll be posting updates and proving some amount of support at [`@clerotri@lea.pet`][fedi].

​### What's new

- As promised when I released v0.6.0: Clerotri now has **server settings!** Edit your server's info, revoke bans and invites, kick that one person who never seems to read the channel topic despite repeated warnings when it's literally _RIGHT THERE_- and much more.
- Now for a fun surprise... **translations!** Yes, you read that correctly - **Clerotri now has support for other languages**. v0.7.0 includes support for a few languages, and more will be added in future updates.
  - Speaking of which... if you speak another language well, **you can get involved!** Go to [Revolt's Weblate instance][weblate] and create an account there, then select your language (or start a new translation if it isn't already listed) and get translating!
  - If you need any help, have questions about a particular translation or just want to chat with other translators, I'd also recommend joining the **official [Revolt Translators server][revolt_translators]**. You don't need to be a translator to join, either - if you're just curious about how it works or want to see what's going on, feel free to stop by!
- The app now lets you browse servers on [Discover][discover]! Support for bots will be added in the future.
- Clerotri has added support for **pinned messages**! They were added relatively recently to Revolt, but to my knowledge they aren't available in any other clients yet 👀
- Now for some smaller tweaks and improvements:
  - uh some other things
  - The server info sheet now lets you know whether a server is publicly joinable via Discover and shows badges for verified/official servers.
- Clerotri now uses React Native 0.76 and targets Android 14. Not quite as exciting as the rest of these, but it's nice to be up to date :3
  - (The app should be smaller and faster as a result, though.)

​### Experimental/WIP features

TBD

​### Bug fixes

- Servers that aren't explicitly ordered in the synced server list will now correctly show at the bottom - in other words, you won't have to drag them about on the web app first.

​### Known issues

TBD

[commits]: https://github.com/upryzing/clerotri/compare/v0.6.0...v0.7.0
[flower]: https://en.wikipedia.org/wiki/Clerodendrum_trichotomum
[fedi]: https://lea.pet/@clerotri
[weblate]: https://translate.revolt.chat/projects/rvmorb/
[revolt_translators]: https://rvlt.gg/i18n
[discover]: https://rvlt.gg

## v0.6.0

_This version was released on 14/07/2023._

### Important info for users of 0.5.0 or earlier

If you're one of the people using 0.5.0 or older versions of RVMob, you'll need to **clear your app data** before upgrading. To do this:

- Open the Settings app
- Go to the Apps section and search for RVMob
- Select the option labelled "Storage and cache" or similar
- Select "Clear storage" and optionally "Clear cache"

(These steps may vary depending on your device's manufacturer/your version of Android.)

This is a **one time operation** - in future, any major changes to the settings system will include migrators for existing users. You'll also have to log back in after doing this.

### What's new

- RVMob now uses React Native 0.72 (including Hermes, which provides various improvements)/Typescript.
- You can now log in using your email/password!
  - There's also partial 2FA support; you can log in using one-time codes.
- Profiles have been largely redesigned, making them less cramped and better suited for future features.
  - As part of this work, status settings have been moved to their own menu.
- RVMob now supports [Revolt's reports system][revolt_reports_post]. This allows you to flag up messages, servers and users that violate Revolt's [Terms of Service][revolt_tos] or the [Acceptable Use Policy][revolt_aup], helping to keep the platform safe.
  - To report a message, long tap it and select "Report Message".
  - To report a server, tap its name above the channel list and select "Report Server".
  - To report a user, open their profile, tap the three dots next to their profile picture and select "Report User".
- The settings system has been fully reworked, making it more maintainable and easier to work with.
  - Alongside this, the settings menu has received various visual improvements.
  - Settings are now split into categories, making the menu feel less cluttered.
  - In addition, you can now copy useful debug information (including your device model, your current settings and your version of Android) - if you're reporting a bug, please include this info.
- The right menu (which was largely unused) has been removed - instead, the member list and channel description are now available via dedicated buttons at the top of the channel view.
- The home screen now shows an emoji/link for certain holidays/special dates.
- In line with the web app:
  - DMs are now sorted by when the last message was sent.
  - Servers are now sorted in the order you reorder them to.
  - Users in the friends list are now sorted by username, and individual sections can now be collapsed.
  - You can now collapse categories in the server channel list.
- Server invites now embed below the message.
- You can now leave servers via the server info sheet.
- Messages from blocked users are now hidden.
- A variety of design improvements have been made across the app - in particular, various elements have bigger margins, making the app feel less crowded.
- The server invite screen and info sheet now show how many members the server has.
- Various code improvements have also been made, making the code much easier to navigate and maintain.
- The navigation bar now uses the colour of the message box.

#### Experimental/WIP features

- Custom emojis in messages will now be detected and replaced with a link - proper rendering will hopefully be added in a future update.
- Embeds specified by bots will now be partially rendered - better styling and support for fields like custom colours will be added in a future update.
- Notifications should work while the app is open in the background, and basic support for in-app notifications has been added.
- Reactions can now optionally be shown under messages! You can also add to existing reactions if you have the React permission - further functionality (i.e. adding new reactions/seeing who's reacted) will be added in a future update.

### Screenshots

#### New profiles

![](./screenshots/changelogs/0.6.0/new_profiles.png)

#### Status menu

![](./screenshots/changelogs/0.6.0/status_menu.png)

#### Reporting menu

![](./screenshots/changelogs/0.6.0/reporting_menu.png)

#### Updated server info sheet

![](./screenshots/changelogs/0.6.0/server_info_sheet.png)

#### Server invite embeds

![](./screenshots/changelogs/0.6.0/invite_embeds.png)

#### Revamped settings menu

![](./screenshots/changelogs/0.6.0/new_settings_menu.png)
![](./screenshots/changelogs/0.6.0/new_settings_menu_section.png)

### Known issues

- When opening the app for the first time, it might get stuck on the "Logging in..." screen. If this happens, close and re-open the app via the app switcher. This seems to only happen on the first boot and is inconsistent - I'm still trying to figure out why this occurs.
- The app is a bit laggy in places - in particular, the friends list can take a bit to load.
- The app may freeze up when trying to fetch the member count in larger servers - due to this, this feature has been turned off for the Revolt Lounge, which during testing was particularly bad in this regard.
- Most gradient roles will appear as plain black text (excluding basic linear gradients, which will show as the first colour in the gradient). This is partially a React Native limitation; however, a better mitigation for this will be added in a future update.
- The image viewer may incorrectly crop certain images, rendering parts of them invisible. You can open them in the browser to view the full image.
- The Send Friend Request button on profiles might not work - I'm still trying to figure out why.

### What's next

- Recovery code support for 2FA
- Full support for reactions
- Server/channel settings
- New message view (code wise)
- Even more code improvements

[revolt_tos]: https://revolt.chat/terms
[revolt_aup]: https://revolt.chat/aup
[revolt_reports_post]: https://revolt.chat/posts/improving-user-safety?utm_source=rvmob_changelog_0.6.0
