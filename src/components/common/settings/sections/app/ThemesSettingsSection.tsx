import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useMMKVString} from 'react-native-mmkv';

import {
  CreateThemeButton,
  ThemeOption,
  ThemePreview,
} from '@clerotri/components/common/settings/sections/app/themes';
import {LineSeparator} from '@clerotri/components/layout';
import {settings} from '@clerotri/lib/settings';
import {
  commonValues,
  getCustomThemeCollection,
  themes,
} from '@clerotri/lib/themes';

export const ThemesSettingsSection = observer(() => {
  const [currentThemeName = settings.getDefault('ui.theme') as string] =
    useMMKVString('ui.theme');

  const [previewedTheme, setPreviewedTheme] = useState(currentThemeName);

  const customThemes = getCustomThemeCollection();

  return (
    <>
      <ThemePreview previewedTheme={previewedTheme} />
      <View>
        <ScrollView
          horizontal
          contentContainerStyle={{gap: commonValues.sizes.medium}}
          showsHorizontalScrollIndicator={false}>
          <CreateThemeButton onPress={() => {}} />
          {Object.entries(customThemes).map(([id]) => {
            return (
              <ThemeOption
                key={`theme-option-custom-${id}`}
                name={`custom-${id}`}
                currentThemeName={previewedTheme}
                onPress={() => setPreviewedTheme(`custom-${id}`)}
              />
            );
          })}
          <LineSeparator vertical style={{marginBlockEnd: 14}} />
          {Object.entries(themes).map(([name]) => {
            return (
              <ThemeOption
                key={`theme-option-${name}`}
                name={name}
                currentThemeName={previewedTheme}
                onPress={() => setPreviewedTheme(name)}
              />
            );
          })}
        </ScrollView>
      </View>
    </>
  );
});
