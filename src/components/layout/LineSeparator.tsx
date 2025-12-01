import {View, type ViewProps} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';

export const LineSeparator = ({style, ...props}: ViewProps) => {
  return <View style={[localStyles.lineSeparator, style]} {...props} />;
};

const localStyles = StyleSheet.create(currentTheme => ({
  lineSeparator: {
    height: commonValues.sizes.xs,
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.backgroundTertiary,
  },
}));
