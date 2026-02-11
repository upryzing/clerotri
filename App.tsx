import 'react-native-get-random-values'; // react native moment

import {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {StyleSheet, UnistylesRuntime} from 'react-native-unistyles';
import {ErrorBoundary} from 'react-error-boundary';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import '@clerotri-i18n/i18n';
import {setFunction} from '@clerotri/Generic';
import {MainView} from '@clerotri/MainView';
import {ErrorMessage} from '@clerotri/components/ErrorMessage';
import {initialiseSettings} from '@clerotri/lib/storage/utils';
import {themes, type Theme, ThemeContext} from '@clerotri/lib/themes';

export const App = () => {
  const [theme, setTheme] = useState<Theme>(themes.Dark);

  setFunction('setTheme', (themeName: string) => {
    const newTheme = themes[themeName] ?? themes.Dark;
    setTheme(newTheme);
    // don't trigger this in dev to help catch bits that need updating
    !__DEV__ && UnistylesRuntime.setTheme(themeName);
    StatusBar.setBarStyle(`${newTheme.contentType}-content`);
  });

  useEffect(() => {
    initialiseSettings();
  }, []);

  return (
    <SafeAreaProvider style={localStyles.outer}>
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <GestureHandlerRootView>
          <ThemeContext.Provider
            value={{currentTheme: theme, setCurrentTheme: setTheme}}>
            <ErrorBoundary FallbackComponent={ErrorMessage}>
              <MainView />
            </ErrorBoundary>
          </ThemeContext.Provider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
    outer: {
      backgroundColor: currentTheme.background,
    },
}));
