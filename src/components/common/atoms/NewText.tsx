import {Text as NativeText, type TextProps, type TextStyle} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';
import type {ThemeColour} from '@clerotri/lib/types';

type FullTextProps = TextProps & {
  font?: 'JetBrains Mono' | 'Inter' | 'Open Sans';
  colour?: ThemeColour;
  customColour?: TextStyle['color'];
  type?: 'h1' | 'h2' | 'profile';
};

export const Text = ({style, ...props}: FullTextProps) => {
  localStyles.useVariants({type: props.type, font: props.font});

  return (
    <NativeText
      style={[
        localStyles.text,
        localStyles.textColour(
          props.customColour
            ? {type: 'custom', value: props.customColour}
            : {type: 'theme', value: props.colour ?? 'foregroundPrimary'},
        ),
        style,
      ]}
      {...props}
    />
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  text: {
    // base styles
    color: currentTheme.foregroundPrimary,
    flexWrap: 'wrap',
    fontFamily: 'Open Sans',

    // variants (types/font)
    variants: {
      font: {
        'JetBrains Mono': {fontFamily: 'JetBrains Mono'},
        Inter: {fontFamily: 'Inter'},
        'Open Sans': {fontFamily: 'Open Sans'},
      },
      type: {
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
        profile: {
          fontWeight: 'bold',
          color: currentTheme.foregroundSecondary,
          marginVertical: commonValues.sizes.small,
          textTransform: 'uppercase',
        },
      },
    },
  },
  textColour: ({
    type,
    value,
  }: {type: 'custom'; value: any} | {type: 'theme'; value: ThemeColour}) => ({
    color: type === 'custom' ? value : currentTheme[value],
  }),
}));
