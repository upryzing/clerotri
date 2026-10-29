import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';

export const ActiveIndicator = ({active}: {active: boolean}) => {
  return (
    <View
      style={[
        localStyles.activeIndicator,
        active && localStyles.activeIndicatorActive,
      ]}
    />
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  activeIndicator: {
    width: 40,
    height: 6,
    borderRadius: commonValues.sizes.medium,
  },
  activeIndicatorActive: {
    backgroundColor: currentTheme.foregroundPrimary,
    borderRadius: commonValues.sizes.medium,
  },
}));
