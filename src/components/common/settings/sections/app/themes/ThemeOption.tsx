import {Pressable, View} from 'react-native';
import {ScopedTheme, StyleSheet} from 'react-native-unistyles';

import {ActiveIndicator} from './ActiveIndicator';
import {commonValues} from '@clerotri/lib/themes';

export const ThemeOption = ({
  name,
  currentThemeName,
  onPress,
}: {
  name: string;
  currentThemeName: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      style={{alignItems: 'center', gap: commonValues.sizes.medium}}
      onPress={() => onPress()}>
      <ScopedTheme name={name}>
        <View style={localStyles.background}>
          <View style={localStyles.linesContainer}>
            <View
              style={[localStyles.line, localStyles.lineForegroundPrimary]}
            />
            <View
              style={[localStyles.line, localStyles.lineForegroundSecondary]}
            />
          </View>
        </View>
      </ScopedTheme>
      <ActiveIndicator active={currentThemeName === name} />
    </Pressable>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  background: {
    height: 80,
    width: 60,
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.background,
  },
  linesContainer: {
    alignItems: 'center',
    gap: commonValues.sizes.small,
    padding: commonValues.sizes.medium,
  },
  line: {height: 10, width: 44, borderRadius: commonValues.sizes.small},
  lineForegroundPrimary: {
    backgroundColor: currentTheme.foregroundPrimary,
  },
  lineForegroundSecondary: {
    backgroundColor: currentTheme.foregroundSecondary,
  },
}));
