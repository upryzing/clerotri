import {settingsList} from '@clerotri/lib/settings/list';
import {DEFAULT_API_URL} from '@clerotri/lib/consts';
import {storage} from '@clerotri/lib/storage';
import {Setting} from '@clerotri/lib/types';

export function initialiseSettings() {
  const settingsVersion = storage.getNumber('settingsVersion');
  if (settingsVersion === undefined) {
    const settings = storage.getString('settings');
    if (!settings) {
      storage.set('settingsVersion', 3);
      return;
    }
    try {
      const storedSettings = JSON.parse(settings);
      migrateToIndividualSettings(storedSettings);
    } catch (e) {
      console.error(e);
    }
  } else {
    settingsList.forEach(setting => {
      let value: string | boolean | undefined;
      switch (setting.type) {
        case 'string':
          value = storage.getString(setting.key);
          break;
        case 'number':
          const initialValue = storage.getNumber(setting.key);
          value = initialValue !== undefined ? `${initialValue}` : initialValue;
          console.log(value);
          break;
        case 'boolean':
          value = storage.getBoolean(setting.key);
          break;
      }
      value !== undefined && initialiseSetting(setting.key, value);
    });
  }
}

function initialiseSetting(key: string, value: string | boolean) {
  console.log(key, value);
  let st: Setting | undefined;
  for (const setting of settingsList) {
    if (setting.key === key) {
      st = setting;
    }
  }
  if (st) {
    st.onInitialize && st.onInitialize(value);
  } else {
    console.warn(`[SETTINGS] Unknown setting in MMKV settings: ${key}`);
  }
}

function migrateToIndividualSettings(settings: any) {
  if (Array.isArray(settings)) {
    settings.forEach(setting => {
      migrateToIndividualSetting(setting.key, setting.value);
    });
  } else {
    const keys = Object.keys(settings);
    keys.forEach(key => {
      migrateToIndividualSetting(key, settings[key]);
    });
  }
  storage.set('settingsVersion', 3);
}

function migrateToIndividualSetting(key: string, value: string | boolean) {
  const valueAsNumber = Number.parseInt(`${value}`, 10);
  const finalValue = isNaN(valueAsNumber) ? value : valueAsNumber;
  storage.set(key, finalValue);
  initialiseSetting(key, value);
}

export function getInstanceURL() {
  return storage.getString('instanceURL') ?? DEFAULT_API_URL;
}
