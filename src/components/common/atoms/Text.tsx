import {
  type ColorValue,
  Text as NativeText,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';

type FullTextProps = TextProps & {
  font?: 'JetBrains Mono' | 'Inter' | 'Open Sans';
  colour?: ColorValue;
  type?: 'h1' | 'h2' | 'profile';
};

export const Text = ({style, ...props}: FullTextProps) => {
  const styleArray: StyleProp<TextStyle> = [localStyles.base];

  if (props.type) {
    switch (props.type) {
      case 'h1':
        styleArray.push(localStyles.h1);
        break;
      case 'h2':
        styleArray.push(localStyles.h2);
        break;
      case 'profile':
        styleArray.push(localStyles.profileSubheader);
        break;
      default:
        break;
    }
  }

  if (props.colour) {
    styleArray.push({color: props.colour});
  }

  if (props.font) {
    styleArray.push({fontFamily: props.font});
  }

  if (style) {
    styleArray.push(style);
  }

  return <NativeText style={styleArray} {...props} />;
};

const localStyles = StyleSheet.create(currentTheme => ({
  base: {
    color: currentTheme.foregroundPrimary,
    flexWrap: 'wrap',
    fontFamily: 'Open Sans',
  },
  h1: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: commonValues.sizes.small,
  },
  h2: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: commonValues.sizes.small,
  },
  profileSubheader: {
    fontWeight: 'bold',
    color: currentTheme.foregroundSecondary,
    marginVertical: commonValues.sizes.small,
    textTransform: 'uppercase',
  },
}));
