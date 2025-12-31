import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useMMKVString} from 'react-native-mmkv';

import {Setting} from '@clerotri/lib/types';
import {Input, Text} from '../../atoms';
import {IndicatorIcons} from './IndicatorIcons';

export const StringSetting = ({sRaw}: {sRaw: Setting}) => {
  const {t} = useTranslation();

  const [value = sRaw.default, setValue] = useMMKVString(sRaw.key);

  return (
    <View
      key={`settings_${sRaw.key}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      }}>
      <View>
        <IndicatorIcons s={sRaw} />
        <Text style={{flex: 1, fontWeight: 'bold', marginBottom: 8}}>
          {t(`app.settings.${sRaw.key}`)}
        </Text>
        {sRaw.remark ? (
          <Text
            useNewText
            colour={'foregroundSecondary'}
            style={{marginBottom: 8}}>
            {t(`app.settings.${sRaw.key}_remark`)}
          </Text>
        ) : null}
        <Input
          value={value as string}
          onChangeText={async v => {
            const shouldChange = sRaw.checkBeforeChanging
              ? await sRaw.checkBeforeChanging(v)
              : true;
            if (shouldChange) {
              setValue(v);
              sRaw.onChange && sRaw.onChange(v);
            }
          }}
        />
      </View>
    </View>
  );
};
