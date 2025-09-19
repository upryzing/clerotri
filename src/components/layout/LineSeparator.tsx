import {useContext} from 'react';
import {StyleSheet, View, type ViewProps} from 'react-native';

import {type Theme, ThemeContext, commonValues} from '@clerotri/lib/themes';

export const LineSeparator = ({style, ...props}: ViewProps) => {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  return <View style={[localStyles.lineSeparator, style]} {...props} />;
};

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    lineSeparator: {
      height: commonValues.sizes.xs,
      borderRadius: commonValues.sizes.medium,
      backgroundColor: currentTheme.backgroundTertiary,
    },
  });
};
