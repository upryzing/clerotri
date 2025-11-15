import {View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useMMKVBoolean} from 'react-native-mmkv';

import {
  BoolSetting,
  OptionSetting,
  NumberSetting,
  StringSetting,
} from './atoms';
import {settings, settingsList} from '@clerotri/lib/settings';

export const SettingsCategory = observer(({category}: {category: string}) => {
  const [
    showExperimental = settings.getDefault('ui.settings.showExperimental'),
  ] = useMMKVBoolean('ui.settings.showExperimental');

  const [showDev = settings.getDefault('ui.showDeveloperFeatures')] =
    useMMKVBoolean('ui.showDeveloperFeatures');

  return (
    <View key={`settings-category-${category}`}>
      {settingsList.map(sRaw => {
        try {
          if (
            (sRaw.experimental && !showExperimental) ||
            (sRaw.developer && !showDev) ||
            sRaw.category !== category
          ) {
            return null;
          }
          if (sRaw.type === 'boolean') {
            return (
              <BoolSetting key={`settings-${sRaw.key}-outer`} sRaw={sRaw} />
            );
          }
          if (sRaw.type === 'number') {
            return (
              <NumberSetting key={`settings-${sRaw.key}-outer`} sRaw={sRaw} />
            );
          }
          if (sRaw.type === 'string') {
            return sRaw.options ? (
              <OptionSetting key={`settings-${sRaw.key}-outer`} sRaw={sRaw} />
            ) : (
              <StringSetting key={`settings-${sRaw.key}-outer`} sRaw={sRaw} />
            );
          }
        } catch (err) {
          console.log(err);
        }
      })}
    </View>
  );
});
