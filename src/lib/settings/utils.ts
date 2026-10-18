import {settingsList} from '@clerotri/lib/settings/list';
import {storage} from '@clerotri/lib/storage';

export const settings = {
  _fetch: (k: string) => {
    const s = settingsList[k];
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
      const value = getSettingValue(k, setting.type);
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
      for (const [key, setting] of Object.entries(settingsList)) {
        storage.remove(key);
        setting.onChange && setting.onChange(setting.default);
      }
    } catch (err) {
      console.log(`[SETTINGS] Error clearing settings: ${err}`);
    }
  },
};

const getSettingValue = (
  key: string,
  type: 'string' | 'number' | 'boolean',
) => {
  switch (type) {
    case 'string':
      return storage.getString(key);
    case 'number':
      return storage.getNumber(key);
    case 'boolean':
      return storage.getBoolean(key);
  }
};

export const getSettingsObject = () => {
  const settingsObject: any = {};

  Object.entries(settingsList).forEach(([key, setting]) => {
    const value = getSettingValue(key, setting.type);

    if (value !== undefined) {
      settingsObject[key] = value;
    }
  });

  return settingsObject;
};
