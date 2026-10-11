import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useMMKVString} from 'react-native-mmkv';

import {
  ThemeOption,
  ThemePreview,
} from '@clerotri/components/common/settings/sections/app/themes';
import {settings} from '@clerotri/lib/settings';
import {commonValues, themes} from '@clerotri/lib/themes';

export const ThemesSettingsSection = observer(() => {
  const [currentThemeName = settings.getDefault('ui.theme') as string] =
    useMMKVString('ui.theme');

  const [previewedTheme, setPreviewedTheme] = useState(currentThemeName);

  return (
    <>
      <ThemePreview previewedTheme={previewedTheme} />
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
