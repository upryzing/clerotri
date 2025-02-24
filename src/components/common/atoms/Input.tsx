import {useContext} from 'react';
import {StyleSheet, TextInput, type TextInputProps} from 'react-native';

import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';

type InputProps = TextInputProps & {
  isLoginInput?: boolean;
  skipRegularStyles?: boolean;
};

export function Input(props: InputProps) {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

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

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
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
      padding: commonValues.sizes.medium,
      paddingHorizontal: commonValues.sizes.large,
      margin: commonValues.sizes.medium,
      width: '80%',
    },
  });
};
