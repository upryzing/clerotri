import type {ModuleType} from 'i18next';

import {storage} from '@clerotri/lib/storage';

const STORE_LANGUAGE_KEY = 'app.language';

export const languageDetectorPlugin = {
  type: 'languageDetector' as ModuleType,
  init: () => {},
  detect: function () {
    try {
      const rawSettings = storage.getString('settings');
      if (!rawSettings) {
        return 'en';
      }

      const settings = JSON.parse(rawSettings);

      // TODO: use device language if there isn't a stored language
      return settings[STORE_LANGUAGE_KEY] ?? 'en';
    } catch (error) {
      console.warn(`[APP] Error reading language: ${error}`);
      return 'en';
    }
  },
  cacheUserLanguage: function (language: string) {
    try {
      const settings = JSON.parse(storage.getString('settings') ?? '{}');
      settings[STORE_LANGUAGE_KEY] = language;
      const newData = JSON.stringify(settings);
      storage.set('settings', newData);
    } catch (error) {}
  },
};
