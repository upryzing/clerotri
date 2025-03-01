import {useContext, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {settings} from '@clerotri/Generic';
import {Setting} from '@clerotri/lib/types';
import {Checkbox, Text} from '../../atoms';
import {IndicatorIcons} from './IndicatorIcons';
import {ThemeContext} from '@clerotri/lib/themes';

export const BoolSetting = ({
  sRaw,
  experimentalFunction,
  devFunction,
}: {
  sRaw: Setting;
  experimentalFunction: any;
  devFunction: any;
}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const [value, setValue] = useState(settings.get(sRaw.key) as boolean);
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
          <Text colour={currentTheme.foregroundSecondary}>
            {t(`app.settings.${sRaw.key}_remark`)}
          </Text>
        ) : null}
      </View>
      <Checkbox
        key={`checkbox-${sRaw.key}`}
        value={value}
        callback={() => {
          const newValue = !value;
          settings.set(sRaw.key, newValue);
          setValue(newValue);
          sRaw.key === 'ui.settings.showExperimental'
            ? experimentalFunction(newValue)
            : null;
          sRaw.key === 'ui.showDeveloperFeatures'
            ? devFunction(newValue)
            : null;
        }}
      />
    </View>
  );
};
