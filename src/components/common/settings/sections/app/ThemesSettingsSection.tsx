import {useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {useMMKVString} from 'react-native-mmkv';

import {Text} from '@clerotri/components/common/atoms';
import {settings} from '@clerotri/lib/settings';
import {commonValues, themes, type Theme} from '@clerotri/lib/themes';

const ThemeOption = ({
  name,
  data,
  currentThemeName,
  onPress,
}: {
  name: string;
  data: Theme;
  currentThemeName: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      style={{alignItems: 'center', gap: commonValues.sizes.medium}}
      onPress={() => onPress()}>
      <View
        style={{
          height: 80,
          width: 60,
          borderRadius: commonValues.sizes.medium,
          backgroundColor: data.background,
        }}>
        <View
          style={{
            alignItems: 'center',
            gap: commonValues.sizes.small,
            padding: commonValues.sizes.medium,
          }}>
          <View
            style={{
              height: 10,
              width: 44,
              borderRadius: commonValues.sizes.small,
              backgroundColor: data.foregroundPrimary,
            }}
          />
          <View
            style={{
              height: 10,
              width: 44,
              borderRadius: commonValues.sizes.small,
              backgroundColor: data.foregroundSecondary,
            }}
          />
        </View>
      </View>
      <View
        style={[
          localStyles.currentThemeIndicator,
          currentThemeName === name && localStyles.currentThemeIndicatorActive,
        ]}
      />
    </Pressable>
  );
};

export const ThemesSettingsSection = observer(() => {
  const {t} = useTranslation();

  const [currentThemeName = settings.getDefault('ui.theme') as string] =
    useMMKVString('ui.theme');

  const [previewedTheme, setPreviewedTheme] = useState(currentThemeName);

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingBlock: commonValues.sizes.medium,
          gap: commonValues.sizes.medium,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: themes[previewedTheme].background,
            borderRadius: commonValues.sizes.medium,
            borderWidth: commonValues.sizes.xs,
            borderColor: themes[previewedTheme].backgroundTertiary
          }}
        />
        <Text style={{fontWeight: 'bold', alignSelf: 'center', fontSize: 16}}>
          {t(`app.themes.${previewedTheme}`)}
        </Text>
      </View>
      <View>
        <ScrollView
          horizontal
          contentContainerStyle={{gap: commonValues.sizes.medium}}
          showsHorizontalScrollIndicator={false}>
          {Object.entries(themes).map(([name, data]) => {
            return (
              <ThemeOption
                key={`theme-option-${name}`}
                name={name}
                data={data}
                currentThemeName={currentThemeName}
                onPress={() => setPreviewedTheme(name)}
              />
            );
          })}
        </ScrollView>
      </View>
    </>
  );
});

const localStyles = StyleSheet.create(currentTheme => ({
  currentThemeIndicator: {
    width: 40,
    height: 6,
    borderRadius: commonValues.sizes.medium,
  },
  currentThemeIndicatorActive: {
    backgroundColor: currentTheme.foregroundPrimary,
  },
}));
