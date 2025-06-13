import {settingsList} from '@clerotri/Generic';
import {DEFAULT_API_URL} from '@clerotri/lib/consts';
import {storage} from '@clerotri/lib/storage';
import {Setting} from '@clerotri/lib/types';

export function initialiseSettings() {
  const settings = storage.getString('settings');
  if (settings) {
    try {
      const storedSettings = JSON.parse(settings);
      if (!Array.isArray(storedSettings)) {
        initialiseObjectSettings(storedSettings);
      } else {
        const newSettings = {} as any;
        storedSettings.forEach((key: {key: string; value: any}) => {
          if (key.key === 'app.instance') {
            storage.set('instanceURL', key.value);
          } else {
            newSettings[key.key] = key.value;
          }
        });
        const newData = JSON.stringify(newSettings);
        storage.set('settings', newData);
        initialiseObjectSettings(newSettings);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

function initialiseObjectSettings(storedSettings: any) {
  Object.keys(storedSettings).forEach(key => {
    let st: Setting | undefined;
    for (const setting of settingsList) {
      if (setting.key === key) {
        st = setting;
      }
    }
    if (st) {
      st.value = storedSettings[key];
      st.onInitialize && st.onInitialize(storedSettings[key]);
    } else {
      console.warn(`[SETTINGS] Unknown setting in MMKV settings: ${key}`);
    }
  });
}

export function getInstanceURL() {
  return storage.getString('instanceURL') ?? DEFAULT_API_URL;
}
