import {StyleSheet, type UnistylesThemes} from 'react-native-unistyles';

import {settings} from '@clerotri/lib/settings';
import {themes} from '@clerotri/lib/themes';

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
  themes: themes,
});
