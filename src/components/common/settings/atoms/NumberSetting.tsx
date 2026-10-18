import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useMMKVNumber} from 'react-native-mmkv';

import {Input, Text} from '@clerotri/components/common/atoms';
import {IndicatorIcons} from '@clerotri/components/common/settings/atoms/IndicatorIcons';
import {commonValues} from '@clerotri/lib/themes';
import type {Setting} from '@clerotri/lib/types';

export const NumberSetting = ({
  settingKey,
  setting,
}: {
  settingKey: string;
  setting: Setting;
}) => {
  const {t} = useTranslation();

  const [value = setting.default, setValue] = useMMKVNumber(settingKey);

  return (
    <View key={`settings_${settingKey}`}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBlockEnd: commonValues.sizes.medium,
        }}>
        <IndicatorIcons s={setting} />
        <View style={{flex: 1}}>
          <Text useNewText style={{fontWeight: 'bold'}}>
            {t(`app.settings.${settingKey}`)}
          </Text>
          {setting.remark ? (
            <Text useNewText colour={'foregroundSecondary'}>
              {t(`app.settings.${settingKey}_remark`)}
            </Text>
          ) : null}
        </View>
      </View>
      <View>
        <Input
          value={`${value}`}
          keyboardType={'decimal-pad'}
          onChangeText={async v => {
            const shouldChange = setting.checkBeforeChanging
              ? await setting.checkBeforeChanging(v)
              : true;
            if (shouldChange) {
              const newValue = Number.parseInt(v, 10);
              setValue(newValue);
              setting.onChange && setting.onChange(newValue);
            }
          }}
        />
      </View>
    </View>
  );
};
