import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues, type Theme} from '@clerotri/lib/themes';

export const ThemeOption = ({
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
