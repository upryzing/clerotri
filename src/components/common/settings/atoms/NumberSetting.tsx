import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useMMKVNumber} from 'react-native-mmkv';

import {Input, Text} from '@clerotri/components/common/atoms';
import {IndicatorIcons} from '@clerotri/components/common/settings/atoms/IndicatorIcons';
import {commonValues} from '@clerotri/lib/themes';
import type {Setting} from '@clerotri/lib/types';

export const NumberSetting = ({sRaw}: {sRaw: Setting}) => {
  const {t} = useTranslation();

  const [value = sRaw.default, setValue] = useMMKVNumber(sRaw.key);

  return (
    <View key={`settings_${sRaw.key}`}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBlockEnd: commonValues.sizes.medium,
        }}>
        <IndicatorIcons s={sRaw} />
        <View style={{flex: 1}}>
          <Text useNewText style={{fontWeight: 'bold'}}>
            {t(`app.settings.${sRaw.key}`)}
          </Text>
          {sRaw.remark ? (
            <Text useNewText colour={'foregroundSecondary'}>
              {t(`app.settings.${sRaw.key}_remark`)}
            </Text>
          ) : null}
        </View>
      </View>
      <View>
        <Input
          value={`${value}`}
          keyboardType={'decimal-pad'}
          onChangeText={async v => {
            const shouldChange = sRaw.checkBeforeChanging
              ? await sRaw.checkBeforeChanging(v)
              : true;
            if (shouldChange) {
              const newValue = Number.parseInt(v, 10);
              setValue(newValue);
              sRaw.onChange && sRaw.onChange(newValue);
            }
          }}
        />
      </View>
    </View>
  );
};
