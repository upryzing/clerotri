# Release checklist

## Pre-release

- [ ] Optional: set a release date in advance and notify translators to give them a chance to translate strings
- [ ] Run an initial release build (`yarn android-release`) and perform any relevant testing - do this **before** releasing

## Release

- [ ] Update `versionName` and `versionCode` in `android/app/build.gradle`
- [ ] Update the `version` field in the `package.json` file
- [ ] Create a new file in `fastlane/metadata/android/en-US/changelogs/` - named `xyz.txt`, with `xyz` being the new `versionCode` - and note the biggest changes in the release, with a link to the full `CHANGELOG.md` entry - **this cannot exceed 500 characters**
- [ ] Update `changelogParagraphs` in `src/components/sheets/ChangelogSheet.tsx` with a short summary of the changes
- [ ] Write out a full changelog entry for `CHANGELOG.md` - use the previous entries as a guide for formatting
  - You can use `git log v[VERSION]...main --format="%s (%h)"` to get a clean list of commits since the last release - this can help make sure you don't miss anything
- [ ] Stage and commit these changes in a commit titled `release: x.y.z` (with `x.y.z` being the new version) - do **not** push the commit yet
- [ ] Run another release build **_after_** committing the changes and check that everything looks right - if not, undo the commit, make any necessary changes and repeat
  - You **_must_** run the final release build **_after_** making the release commit - if you don't, it'll break reproducible builds for the release, and the app itself will link to the wrong commit in the about page
- [ ] Once you're **certain** that everything is ready, run the full release build command (`yarn android-release:full`) and push the release commit
- [ ] On GitHub, [create a new release](https://github.com/upryzing/clerotri/releases/new) - **make sure you create a new tag!** - and upload the 4 APK files in `android/app/build/outputs/apk/release`, renaming them to `Clerotri-v[VERSION]-[ARCH].apk` (e.g. `Clerotri-v0.13.0-arm64-v8a.apk`)
- [ ] Open [the Accrescent console](https://console.accrescent.app/apps/app.upryzing.clerotri/details) and submit a new update, using the APK set file in `android/app/build/outputs/apkset/release`

## Post release

- [ ] Announce the new release in the Stoat server's #announcement channel...
- [ ] ...and post a link to it in the #version channel
- [ ] Post an announcement on [the fedi account](https://lea.pet/@clerotri)
- [ ] Post an announcement on [the Bluesky account](https://bsky.app/profile/clerotri.upryzing.app)
