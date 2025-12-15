import {Fragment} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {useMMKVString} from 'react-native-mmkv';

import {languages} from '@clerotri-i18n/languages';
import {styles} from '@clerotri/Theme';
import {commonValues} from '@clerotri/lib/themes';
import {Setting} from '@clerotri/lib/types';
import {Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {IndicatorIcons} from './IndicatorIcons';
import {LineSeparator} from '@clerotri/components/layout';

export const OptionSetting = ({sRaw}: {sRaw: Setting}) => {
  const {t} = useTranslation();

  const [value = sRaw.default, setValue] = useMMKVString(sRaw.key);

  return (
    <View style={{marginTop: 10}}>
      <IndicatorIcons s={sRaw} />
      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: commonValues.sizes.medium,
        }}>
        {t(`app.settings.${sRaw.key}`)}
      </Text>
      {sRaw.remark ? (
        <Text
          useNewText
          colour={'foregroundSecondary'}
          style={{marginBottom: commonValues.sizes.medium}}>
          {t(`app.settings.${sRaw.key}_remark`)}
        </Text>
      ) : null}
      <View style={localStyles.optionsContainer}>
        {sRaw.options!.map((o, i) => (
          <Fragment key={o}>
            <TouchableOpacity
              style={[localStyles.option]}
              onPress={async () => {
                const shouldChange = sRaw.checkBeforeChanging
                  ? await sRaw.checkBeforeChanging(o)
                  : true;
                if (shouldChange) {
                  setValue(o);
                  sRaw.onChange && sRaw.onChange(o);
                }
              }}>
              {sRaw.key === 'app.language' ? (
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{alignSelf: 'center', marginEnd: 8}}>
                    {languages[o].emoji}
                  </Text>
                  <View style={{flexDirection: 'column'}}>
                    <Text style={{fontWeight: 'bold'}}>
                      {languages[o].name}
                    </Text>
                    <Text useNewText colour={'foregroundSecondary'}>
                      {languages[o].englishName}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={{flex: 1}}>
                  {sRaw.key === 'ui.theme' ? t(`app.themes.${o}`) : o}
                </Text>
              )}
              <View style={{...styles.iconContainer, marginRight: 0}}>
                <MaterialIcon
                  name={`radio-button-${value === o ? 'on' : 'off'}`}
                  size={28}
                  color={'accentColor'}
                />
              </View>
            </TouchableOpacity>
            {i !== sRaw.options!.length - 1 && <LineSeparator />}
          </Fragment>
        ))}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  optionsContainer: {
    borderRadius: commonValues.sizes.medium,
    minWidth: '100%',
    backgroundColor: currentTheme.backgroundSecondary,
    paddingInline: commonValues.sizes.large,
    paddingBlock: commonValues.sizes.xs,
  },
  option: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBlock: commonValues.sizes.medium,
  },
}));
