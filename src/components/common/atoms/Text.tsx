import {
  type ColorValue,
  Text as NativeText,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {Text as NewText} from './NewText';
import {commonValues} from '@clerotri/lib/themes';
import {ThemeColour} from '@clerotri/lib/types';

type CommonTextProps = TextProps & {
  font?: 'JetBrains Mono' | 'Inter' | 'Open Sans';
  customColour?: ColorValue;
  type?: 'h1' | 'h2' | 'profile';
};

type LegacyTextProps = CommonTextProps & {
  colour?: ColorValue;
};

type NewTextProps = CommonTextProps & {
  colour?: ThemeColour;
};

export const LegacyText = ({style, ...props}: LegacyTextProps) => {
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

  if (props.customColour) {
    styleArray.push({color: props.customColour});
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

export const Text = ({
  useNewText,
  ...props
}:
  | (NewTextProps & {useNewText: true})
  | (LegacyTextProps & {useNewText?: false})) => {
  // @ts-expect-error this is going away soon enoughso meh
  return useNewText ? <NewText {...props} /> : <LegacyText {...props} />;
};
