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

export function ContextButton({backgroundColor, style, ...props}: ButtonProps) {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  return (
    <TouchableOpacity
      style={[
        localStyles.contextButton,
        backgroundColor && {backgroundColor},
        style,
      ]}
      {...props}
    />
  );
}

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    contextButton: {
      height: 40,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: currentTheme.backgroundPrimary,
      borderRadius: commonValues.sizes.medium,
      paddingInline: 10,
      marginVertical: commonValues.sizes.small,
    },
  });
};
