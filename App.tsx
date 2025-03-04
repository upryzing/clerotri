import 'react-native-get-random-values'; // react native moment

import {useEffect, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {ErrorBoundary} from 'react-error-boundary';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {setFunction} from '@clerotri/Generic';
import {MainView} from '@clerotri/MainView';
import {ErrorMessage} from '@clerotri/components/ErrorMessage';
import {initialiseSettings} from '@clerotri/lib/storage/utils';
import {themes, type Theme, ThemeContext} from '@clerotri/lib/themes';

export const App = () => {
  const [theme, setTheme] = useState<Theme>(themes.Dark);

  const localStyles = generateLocalStyles(theme);

  setFunction('setTheme', (themeName: string) => {
    const newTheme = themes[themeName] ?? themes.Dark;
    setTheme(newTheme);
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

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    outer: {
      backgroundColor: currentTheme.background,
    },
  });
};
