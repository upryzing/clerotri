# Building Clerotri

## Required tools

The following steps assume you're using a terminal.

If you want to build Clerotri for web, you'll need:

- [Node](https://nodejs.org/en/) (22+) and
- [Yarn Berry](https://yarnpkg.com/getting-started/install).

If you want to build Clerotri for Android, you'll also need:

- JDK 17 ([Microsoft's build](https://learn.microsoft.com/en-gb/java/openjdk/download) works well) and
- the latest Android SDK (preferably via [Android Studio](https://developer.android.com/studio)'s SDK Manager).

## Steps

Clone the repository, then open the project folder:

```sh
git clone https://github.com/upryzing/clerotri
cd clerotri
```

Once you've opened the folder, run the following:

```sh
# install the dependencies...
yarn install

# ...then copy the font files into the native folder:
npx react-native-asset
```

### Web

To run the development version of Clerotri for web, run:

```sh
yarn web
```

To build an optimised release version, run:

```sh
yarn web-release
```

### Android

To run the development version of Clerotri for web, run:

```sh
# build and install the native app...
yarn android

# ...then run Metro (the JS dev server)
yarn start
```

To build an optimised release version, run:

```sh
yarn android-release
```

> [!TIP]
> You can run the JS bundling step separately from the actual app compilation/bundling step - for example, if you only need to rebuild the native code - by running `yarn android-release:bundle` and `yarn android-release:apk` respectively. **Make sure you've built the JS bundle first, or the app won't run!**

## CLI commands

| Command        | Description                                         |
| -------------- | --------------------------------------------------- |
| `yarn start`   | Starts Metro (the JS dev server).                   |
| `yarn web`     | Runs the web app.                                   |
| `yarn android` | Runs the Android app.                               |
| `yarn ios`     | Runs the iOS app (broken, requires a Mac).          |
| `yarn format`  | Formats the code using Prettier.                    |
| `yarn lint`    | Checks the code syntax using ESLint.                |
| `yarn test`    | Runs the tests in the `__tests__` folder with Jest. |

For more information, see a list of `react-native`'s commands [here](https://github.com/react-native-community/cli/blob/master/docs/commands.md). You can access them by running `yarn react-native`.

Note that the app uses `rnx-bundle`, which has extra features (and will produce a smaller bundle) compared to the default bundle command.
