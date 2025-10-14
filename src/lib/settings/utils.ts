import { settingsList } from "@clerotri/lib/settings/list";
import { storage } from "@clerotri/lib/storage";

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
  getRaw: (k: string) => {
    const setting = settings._fetch(k);
    if (!setting) {
      console.log(`[SETTINGS] Setting ${k} does not exist; func = getRaw`);
      return null;
    }
    return setting.value !== undefined ? setting.value : setting.default;
  },
  get: (k: string) => {
    const setting = settings._fetch(k);
    if (!setting) {
      console.warn(`[SETTINGS] Setting ${k} does not exist; func = get`);
      return null;
    }
    const raw =
      setting.value !== undefined &&
      (setting.experimental
        ? settings._fetch('ui.settings.showExperimental')?.value
        : true) &&
      (setting.developer
        ? settings._fetch('ui.showDeveloperFeatures')?.value
        : true)
        ? setting.value
        : setting.default;
    const toreturn =
      setting.type === 'number' ? parseInt(raw as string, 10) || 0 : raw;
    return toreturn;
  },
  set: (k: string, v: string | boolean | undefined) => {
    try {
      const setting = settings._fetch(k);
      if (!setting) {
        console.warn(`[SETTINGS] Setting ${k} does not exist; func = set`);
        return null;
      }
      setting.value = v;
      setting.onChange && setting.onChange(v);
      settings.save();
    } catch (err) {
      console.log(`[SETTINGS] Error setting setting ${k} to ${v}: ${err}`);
    }
  },
  save: () => {
    try {
      const out = {} as any;
      for (const s of settingsList) {
        if (s.value !== undefined) {
          out[s.key] = s.value;
        }
      }
      storage.set('settings', JSON.stringify(out));
    } catch (err) {
      console.log(`[SETTINGS] Error saving settings: ${err}`);
    }
  },
  clear: () => {
    try {
      storage.delete('settings');
      for (const s of settingsList) {
        delete s.value;
        s.onChange && s.onChange(s.default);
      }
    } catch (err) {
      console.log(`[SETTINGS] Error clearing settings: ${err}`);
    }
  },
};
