import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useMMKVString} from 'react-native-mmkv';

import type {Setting} from '@clerotri/lib/types';
import {Input, Text} from '../../atoms';
import {IndicatorIcons} from './IndicatorIcons';

export const StringSetting = ({
  settingKey,
  setting,
}: {
  settingKey: string;
  setting: Setting;
}) => {
  const {t} = useTranslation();

  const [value = setting.default, setValue] = useMMKVString(settingKey);

  return (
    <View
      key={`settings_${settingKey}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View>
        <IndicatorIcons s={setting} />
        <Text style={{flex: 1, fontWeight: 'bold', marginBottom: 8}}>
          {t(`app.settings.${settingKey}`)}
        </Text>
        {setting.remark ? (
          <Text
            useNewText
            colour={'foregroundSecondary'}
            style={{marginBottom: 8}}>
            {t(`app.settings.${settingKey}_remark`)}
          </Text>
        ) : null}
        <Input
          value={value as string}
          onChangeText={async v => {
            const shouldChange = setting.checkBeforeChanging
              ? await setting.checkBeforeChanging(v)
              : true;
            if (shouldChange) {
              setValue(v);
              setting.onChange && setting.onChange(v);
            }
          }}
        />
      </View>
    </View>
  );
};
