import {settingsList} from '@clerotri/lib/settings/list';
import {storage} from '@clerotri/lib/storage';
import type {Setting} from '@clerotri/lib/types';

export const settings = {
  _fetch: (k: string) => {
    let s;
    for (const setting of settingsList) {
      if (setting.key === k) {
        s = setting;
      }
    }
    if (!s) {
      console.log(`[SETTINGS] Setting ${k} does not exist; func = _fetch`);
      return null;
    }
    return s;
  },
  get: (k: string) => {
    const setting = settings._fetch(k);
    if (!setting) {
      console.warn(`[SETTINGS] Setting ${k} does not exist; func = get`);
      return undefined;
    }

    // if the user disables dev/experimental features, ignore any stored value and return the default
    const useValueIfDev = setting.developer
      ? (storage.getBoolean('ui.showDeveloperFeatures') ?? false)
      : true;
    const useValueIfExperimental = setting.experimental
      ? (storage.getBoolean('ui.settings.showExperimental') ?? false)
      : true;

    if (useValueIfDev && useValueIfExperimental) {
      const value = getSettingValue(setting);
      return value !== undefined ? value : setting.default;
    }

    return setting.default;
  },
  getDefault: (k: string) => {
    const setting = settings._fetch(k);
    if (!setting) {
      console.warn(`[SETTINGS] Setting ${k} does not exist; func = getDefault`);
      return null;
    }
    return setting.default;
  },
  clear: () => {
    try {
      for (const s of settingsList) {
        storage.delete(s.key);
        s.onChange && s.onChange(s.default);
      }
    } catch (err) {
      console.log(`[SETTINGS] Error clearing settings: ${err}`);
    }
  },
};

const getSettingValue = (setting: Setting) => {
  switch (setting.type) {
    case 'string':
      return storage.getString(setting.key);
    case 'number':
      return storage.getNumber(setting.key);
    case 'boolean':
      return storage.getBoolean(setting.key);
  }
};

export const getSettingsObject = () => {
  const settingsObject: any = {};

  settingsList.forEach(setting => {
    const value = getSettingValue(setting);

    if (value !== undefined) {
      settingsObject[setting.key] = value;
    }
  });

  return settingsObject;
};
