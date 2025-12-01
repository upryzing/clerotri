import {TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';
import type {ButtonProps} from '@clerotri/lib/types';

export function Button({backgroundColor, style, ...props}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[localStyles.button, backgroundColor && {backgroundColor}, style]}
      {...props}
    />
  );
}

const localStyles = StyleSheet.create(currentTheme => ({
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
}));
