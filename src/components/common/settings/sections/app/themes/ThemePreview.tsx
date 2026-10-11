import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@clerotri/components/common/atoms';
import {commonValues, themes} from '@clerotri/lib/themes';

export const ThemePreview = ({previewedTheme}: {previewedTheme: string}) => {
  const {t} = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        paddingBlock: commonValues.sizes.medium,
        paddingBlockEnd: commonValues.sizes.large,
        gap: commonValues.sizes.large,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: themes[previewedTheme].backgroundPrimary,
          borderRadius: commonValues.sizes.medium,
          borderWidth: commonValues.sizes.xs,
          borderColor: themes[previewedTheme].backgroundTertiary,
        }}>
        <View
          style={{
            backgroundColor: themes[previewedTheme].headerBackground,
            height: 50,
            borderStartStartRadius: 6,
            borderEndStartRadius: 6,
          }}
        />
        <View style={{flex: 1}} />
        <View
          style={{
            backgroundColor: themes[previewedTheme].messageBox,
            height: 50,
            paddingInline: 10,
            borderStartEndRadius: 6,
            borderEndEndRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <View
            style={{
              backgroundColor: themes[previewedTheme].foregroundPrimary,
              height: 30,
              width: 30,
              borderRadius: commonValues.sizes.medium,
            }}
          />
          <View
            style={{
              backgroundColor: themes[previewedTheme].messageBoxInput,
              height: 30,
              width: 30,
              borderRadius: commonValues.sizes.medium,
              flex: 1,
            }}
          />
          <View
            style={{
              backgroundColor: themes[previewedTheme].accentColor,
              height: 30,
              width: 30,
              borderRadius: commonValues.sizes.medium,
            }}
          />
        </View>
      </View>
      <Text style={{fontWeight: 'bold', alignSelf: 'center', fontSize: 16}}>
        {t(`app.themes.${previewedTheme}`)}
      </Text>
    </View>
  );
};
