import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useMMKVString} from 'react-native-mmkv';

import {app, setFunction} from '@clerotri/Generic';
import {
  CreateThemeButton,
  ThemeOption,
  ThemePreview,
} from '@clerotri/components/common/settings/sections/app/themes';
import {LineSeparator} from '@clerotri/components/layout';
import {useStringSetting} from '@clerotri/lib/settings';
import {
  commonValues,
  getCustomThemeCollection,
  themes,
} from '@clerotri/lib/themes';

export const ThemesSettingsSection = observer(() => {
  const [currentThemeName, setCurrentThemeName] = useStringSetting('ui.theme');
  console.log(currentThemeName);

  const [_storedThemes] = useMMKVString('customThemes');

  const [previewedTheme, setPreviewedTheme] = useState(currentThemeName);

  const customThemes = getCustomThemeCollection();

  setFunction('setPreviewedTheme', (theme: string) => {
    setPreviewedTheme(theme);
  });

  return (
    <>
      <ThemePreview previewedTheme={previewedTheme} />
      <View>
        <ScrollView
          horizontal
          contentContainerStyle={{gap: commonValues.sizes.medium}}
          showsHorizontalScrollIndicator={false}>
          <CreateThemeButton />
          {Object.entries(customThemes).map(([id]) => {
            return (
              <ThemeOption
                key={`theme-option-custom-${id}`}
                name={`custom-${id}`}
                currentThemeName={previewedTheme}
                onPress={() => {
                  app.setTheme(`custom-${id}`);
                  setCurrentThemeName(`custom-${id}`);
                  setPreviewedTheme(`custom-${id}`);
                }}
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
                onPress={() => {
                  app.setTheme(name);
                  setCurrentThemeName(name);
                  setPreviewedTheme(name);
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    </>
  );
});
