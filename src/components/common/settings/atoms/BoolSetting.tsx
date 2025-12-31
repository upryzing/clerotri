import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useMMKVBoolean} from 'react-native-mmkv';

import {Setting} from '@clerotri/lib/types';
import {Checkbox, Text} from '../../atoms';
import {IndicatorIcons} from './IndicatorIcons';

export const BoolSetting = ({sRaw}: {sRaw: Setting}) => {
  const {t} = useTranslation();

  const [value = sRaw.default as boolean, setValue] = useMMKVBoolean(sRaw.key);

  return (
    <View
      key={`settings_${sRaw.key}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      }}>
      <IndicatorIcons s={sRaw} />
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={{fontWeight: 'bold'}}>
          {t(`app.settings.${sRaw.key}`)}
        </Text>
        {sRaw.remark ? (
          <Text useNewText colour={'foregroundSecondary'}>
            {t(`app.settings.${sRaw.key}_remark`)}
          </Text>
        ) : null}
      </View>
      <Checkbox
        key={`checkbox-${sRaw.key}`}
        value={value}
        callback={async () => {
          const newValue = !value;
          const shouldChange = sRaw.checkBeforeChanging
            ? await sRaw.checkBeforeChanging(newValue)
            : true;
          if (shouldChange) {
            setValue(newValue);
            sRaw.onChange && sRaw.onChange(newValue);
          }
        }}
      />
    </View>
  );
};
