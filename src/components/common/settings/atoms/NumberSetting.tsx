import {useContext} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useMMKVNumber} from 'react-native-mmkv';

import {ThemeContext} from '@clerotri/lib/themes';
import {Setting} from '@clerotri/lib/types';
import {Input, Text} from '../../atoms';
import {IndicatorIcons} from './IndicatorIcons';

export const NumberSetting = ({sRaw}: {sRaw: Setting}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const [value = sRaw.default, setValue] = useMMKVNumber(sRaw.key);

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
            colour={currentTheme.foregroundSecondary}
            style={{marginBottom: 8}}>
            {t(`app.settings.${sRaw.key}_remark`)}
          </Text>
        ) : null}
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
