import {useMemo} from 'react';
import {View} from 'react-native';
import {ScopedTheme, StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {Text} from '@clerotri/components/common/atoms';
import {commonValues, getCustomTheme} from '@clerotri/lib/themes';

export const ThemePreview = ({previewedTheme}: {previewedTheme: string}) => {
  const {t} = useTranslation();

  const isCustomTheme = useMemo(
    () => previewedTheme.startsWith('custom'),
    [previewedTheme],
  );

  const customTheme = isCustomTheme
    ? getCustomTheme(previewedTheme.replace('custom-', ''))
    : undefined;

  return (
    <ScopedTheme name={previewedTheme}>
      <View style={localStyles.container}>
        <View style={localStyles.background}>
          <View style={localStyles.header} />
          <View style={{flex: 1}} />
          <View style={localStyles.messageBox}>
            <View style={localStyles.attachmentsButton} />
            <View style={localStyles.messageBoxInput} />
            <View style={localStyles.sendButton} />
          </View>
        </View>
        <ScopedTheme reset>
          <View style={{alignItems: 'center'}}>
            <Text
              useNewText
              style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>
              {isCustomTheme
                ? (customTheme?.name ??
                  t('app.settings_menu.appearance.themes.no_name'))
                : t(`app.themes.${previewedTheme}`)}
            </Text>
            <Text
              useNewText
              colour={'foregroundSecondary'}
              style={{textAlign: 'center'}}>
              {t(
                `app.settings_menu.appearance.themes.${isCustomTheme ? 'custom' : 'built_in'}`,
              )}
            </Text>
          </View>
        </ScopedTheme>
      </View>
    </ScopedTheme>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  container: {
    flex: 1,
    paddingBlock: commonValues.sizes.medium,
    paddingBlockEnd: commonValues.sizes.large,
    gap: commonValues.sizes.large,
  },
  background: {
    flex: 1,
    backgroundColor: currentTheme.backgroundPrimary,
    borderRadius: commonValues.sizes.medium,
    borderWidth: commonValues.sizes.xs,
    borderColor: currentTheme.backgroundTertiary,
  },
  header: {
    backgroundColor: currentTheme.headerBackground,
    height: 50,
    borderStartStartRadius: 6,
    borderEndStartRadius: 6,
  },
  messageBox: {
    backgroundColor: currentTheme.messageBox,
    height: 50,
    paddingInline: 10,
    borderStartEndRadius: 6,
    borderEndEndRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  attachmentsButton: {
    backgroundColor: currentTheme.foregroundPrimary,
    height: 30,
    width: 30,
    borderRadius: commonValues.sizes.medium,
  },
  messageBoxInput: {
    backgroundColor: currentTheme.messageBoxInput,
    height: 30,
    width: 30,
    borderRadius: commonValues.sizes.medium,
    flex: 1,
  },
  sendButton: {
    backgroundColor: currentTheme.accentColor,
    height: 30,
    width: 30,
    borderRadius: commonValues.sizes.medium,
  },
}));
