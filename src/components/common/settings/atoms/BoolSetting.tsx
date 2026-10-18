import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useMMKVBoolean} from 'react-native-mmkv';

import {Checkbox, Text} from '@clerotri/components/common/atoms';
import {IndicatorIcons} from '@clerotri/components/common/settings/atoms/IndicatorIcons';
import {commonValues} from '@clerotri/lib/themes';
import type {Setting} from '@clerotri/lib/types';

export const BoolSetting = ({
  settingKey,
  setting,
}: {
  settingKey: string;
  setting: Setting;
}) => {
  const {t} = useTranslation();

  const [value = setting.default as boolean, setValue] =
    useMMKVBoolean(settingKey);

  return (
    <View
      key={`settings_${settingKey}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <IndicatorIcons s={setting} />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          marginEnd: commonValues.sizes.small,
        }}>
        <Text style={{fontWeight: 'bold'}}>
          {t(`app.settings.${settingKey}`)}
        </Text>
        {setting.remark ? (
          <Text useNewText colour={'foregroundSecondary'}>
            {t(`app.settings.${settingKey}_remark`)}
          </Text>
        ) : null}
      </View>
      <Checkbox
        key={`checkbox-${settingKey}`}
        value={value}
        callback={async () => {
          const newValue = !value;
          const shouldChange = setting.checkBeforeChanging
            ? await setting.checkBeforeChanging(newValue)
            : true;
          if (shouldChange) {
            setValue(newValue);
            setting.onChange && setting.onChange(newValue);
          }
        }}
      />
    </View>
  );
};
