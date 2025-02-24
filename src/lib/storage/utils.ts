import {settings} from '@clerotri/Generic';
import {DEFAULT_API_URL} from '@clerotri/lib/consts';
import {storage} from '@clerotri/lib/storage';
import {Setting} from '@clerotri/lib/types';

export function initialiseSettings() {
  const s = storage.getString('settings');
  if (s) {
    try {
      const storedSettings = JSON.parse(s) as {key: string; value: any}[];
      storedSettings.forEach(key => {
        if (key.key === 'app.instance') {
          storage.set('instanceURL', key.value);
        }
        let st: Setting | undefined;
        for (const setting of settings.list) {
          if (setting.key === key.key) {
            st = setting;
          }
        }
        if (st) {
          st.value = key.value;
          st.onInitialize && st.onInitialize(key.value);
        } else {
          console.warn(`[SETTINGS] Unknown setting in MMKV settings: ${key}`);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export function getInstanceURL() {
  return storage.getString('instanceURL') ?? DEFAULT_API_URL;
}
