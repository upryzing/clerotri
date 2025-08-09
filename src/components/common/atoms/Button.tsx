import {useContext} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';

import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';

type ButtonProps = TouchableOpacityProps & {
  backgroundColor?: string;
};

export function Button({
  backgroundColor,
  style,
  ...props
}: ButtonProps) {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  return (
    <TouchableOpacity
      style={[
        localStyles.button,
        backgroundColor && {backgroundColor},
        style,
      ]}
      {...props} />
  );
}

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    button: {
      padding: commonValues.sizes.large,
      paddingHorizontal: commonValues.sizes.xl,
      borderRadius: commonValues.sizes.medium,
      backgroundColor: currentTheme.buttonBackground,
      margin: 5,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  });
};
