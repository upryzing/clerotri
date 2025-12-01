import {StyleSheet} from 'react-native-unistyles';

import {Text} from './Text';
import {openUrl} from '@clerotri/lib/utils';

type LinkProps = {
  children?: any;
  link: string;
  label: string;
  style?: any;
};

export const Link = ({children, link, label, style}: LinkProps) => {
  let finalStyle = localStyles.link;
  if (style) {
    finalStyle = {...finalStyle, ...style};
  }

  return (
    <Text
      accessibilityRole={'link'}
      onPress={() => openUrl(link)}
      style={finalStyle}>
      {children ?? label}
    </Text>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  link: {
    color: currentTheme.accentColor,
    textDecorationLine: 'underline',
  },
}));
