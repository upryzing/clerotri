import {useMMKVBoolean, useMMKVNumber, useMMKVString} from 'react-native-mmkv';

import {settingsList} from '@clerotri/lib/settings/list';

export const useBoolSetting = (setting: string) => {
  const [storedValue, setStoredValue] = useMMKVBoolean(setting);

  const value =
    storedValue !== undefined
      ? storedValue
      : (settingsList[setting].default as boolean);

  return [value, setStoredValue] as const;
};

export const useNumberSetting = (setting: string) => {
  const [storedValue, setStoredValue] = useMMKVNumber(setting);

  const value =
    storedValue !== undefined
      ? storedValue
      : (settingsList[setting].default as number);

  return [value, setStoredValue] as const;
};

export const useStringSetting = (setting: string) => {
  const [storedValue, setStoredValue] = useMMKVString(setting);

  const value =
    storedValue !== undefined
      ? storedValue
      : (settingsList[setting].default as string);

  return [value, setStoredValue] as const;
};
