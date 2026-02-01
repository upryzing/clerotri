import {useContext} from 'react';
import {TextInput, type TextInputProps} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues, ThemeContext} from '@clerotri/lib/themes';

type InputProps = TextInputProps & {
  isLoginInput?: boolean;
  skipRegularStyles?: boolean;
};

export function Input(props: InputProps) {
  const {currentTheme} = useContext(ThemeContext);

  const {style, ...cleanProps} = props;

  return (
    <TextInput
      style={[
        localStyles.coreInput,
        !props.skipRegularStyles && localStyles.regularInput,
        props.isLoginInput && localStyles.loginInput,
        style,
      ]}
      cursorColor={currentTheme.accentColor}
      selectionHandleColor={currentTheme.accentColor}
      selectionColor={`${currentTheme.accentColor}60`}
      {...cleanProps}
    />
  );
}

const localStyles = StyleSheet.create(currentTheme => ({
  coreInput: {
    fontFamily: 'Open Sans',
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.backgroundSecondary,
    color: currentTheme.foregroundPrimary,
  },
  regularInput: {
    minWidth: '100%',
    padding: commonValues.sizes.large,
  },
  loginInput: {
    padding: commonValues.sizes.large,
    paddingHorizontal: commonValues.sizes.large,
    margin: commonValues.sizes.small,
    width: '80%',
  },
}));
