import type {ModuleType} from 'i18next';

import {storage} from '@clerotri/lib/storage';

const STORE_LANGUAGE_KEY = 'app.language';

export const languageDetectorPlugin = {
  type: 'languageDetector' as ModuleType,
  init: () => {},
  detect: function () {
    // TODO: use device language if there isn't a stored language
    try {
      // new settings system:
      const languageSetting = storage.getString(STORE_LANGUAGE_KEY);
      if (languageSetting) {
        return languageSetting;
      }

      // old settings system (pre-migration):
      const rawSettings = storage.getString('settings');
      if (!rawSettings) {
        return 'en';
      }

      const settings = JSON.parse(rawSettings);

      return settings[STORE_LANGUAGE_KEY] ?? 'en';
    } catch (error) {
      console.warn(`[APP] Error reading language: ${error}`);
      return 'en';
    }
  },
  cacheUserLanguage: function (language: string) {
    try {
      storage.set(STORE_LANGUAGE_KEY, language);
    } catch {}
  },
};
