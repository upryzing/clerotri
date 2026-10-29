import {StyleSheet, type UnistylesThemes} from 'react-native-unistyles';

import {settings} from '@clerotri/lib/settings';
import {
  getCustomThemeCollection,
  getCustomThemeColours,
  themes,
} from '@clerotri/lib/themes';

let finalThemes = {...themes};

try {
  const themeCollection = getCustomThemeCollection();

  const entries = Object.entries(themeCollection);

  if (entries.length) {
    for (const [key, theme] of entries) {
      const finalThemeColours = getCustomThemeColours(theme);
      finalThemes[`custom-${key}`] = finalThemeColours;
    }
  }
} catch {
  finalThemes = themes;
}

StyleSheet.configure({
  settings: {
    initialTheme: () => {
      // the Rosé Pine themes were initially saved with accents, which break Unistyles when used in theme keys
      const theme = `${settings.get('ui.theme')}`.replaceAll('é', 'e');

      return typeof theme === 'string' && Object.keys(themes).includes(theme)
        ? (theme as keyof UnistylesThemes)
        : 'Dark';
    },
  },
  themes: finalThemes,
});
