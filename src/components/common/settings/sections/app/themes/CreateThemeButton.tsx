import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {ulid} from 'ulid';

import {app} from '@clerotri/Generic';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {
  commonValues,
  getCustomThemeCollection,
  themes,
} from '@clerotri/lib/themes';
import {useStringSetting} from '@clerotri/lib/settings';

export const CreateThemeButton = () => {
  const [currentTheme] = useStringSetting('ui.theme');

  return (
    <Pressable
      style={{alignItems: 'center'}}
      onPress={() => {
        const isCustom = !Object.keys(themes).includes(currentTheme);

        app.openThemeEditor({
          themeID: ulid(),
          baseTheme: isCustom
            ? getCustomThemeCollection()[currentTheme].base
            : currentTheme,
          isNew: true,
        });
      }}>
      <View style={localStyles.background}>
        <MaterialIcon name={'add'} size={40} color={'foregroundSecondary'} />
      </View>
    </Pressable>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  background: {
    height: 80,
    width: 60,
    borderRadius: commonValues.sizes.medium,
    outlineColor: currentTheme.foregroundSecondary,
    outlineWidth: commonValues.sizes.xs,
    outlineStyle: 'dashed',
    outlineOffset: -2,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
