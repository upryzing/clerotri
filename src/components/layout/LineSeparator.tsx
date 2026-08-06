import {View, type ViewProps} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';

type SeparatorProps = ViewProps & {
  vertical?: boolean;
};

export const LineSeparator = ({style, vertical, ...props}: SeparatorProps) => {
  return (
    <View style={[localStyles.lineSeparator(vertical), style]} {...props} />
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  lineSeparator: (vertical?: boolean) => ({
    ...(vertical
      ? {width: commonValues.sizes.xs}
      : {height: commonValues.sizes.xs}),
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.backgroundTertiary,
  }),
}));
