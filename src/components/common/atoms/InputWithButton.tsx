import {useContext, useState} from 'react';
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import MaterialIcon from '@react-native-vector-icons/material-icons';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';

import {Button} from '@clerotri/components/common/atoms/Button';
import {Input} from '@clerotri/components/common/atoms/Input';
import {Text} from '@clerotri/components/common/atoms/Text';
import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

export function InputWithButton({
  defaultValue,
  placeholder,
  buttonContents,
  extraStyles,
  onPress,
  skipIfSame,
  cannotBeEmpty,
  emptyError,
  ...props
}: {
  defaultValue?: string;
  placeholder?: string;
  buttonContents:
    | {type: 'string'; content: string}
    | {type: 'icon'; name: string; pack: 'regular' | 'community'};
  extraStyles?: {container?: ViewStyle; input?: TextStyle; button?: ViewStyle};
  onPress: any;
  skipIfSame?: boolean;
  cannotBeEmpty?: boolean;
  emptyError?: string;
}) {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  let [value, setValue] = useState(defaultValue);
  return (
    // style.input and style.button are applied to the input and button respectively
    <View style={[localStyles.iwbContainer, extraStyles?.container]}>
      <Input
        value={value}
        onChangeText={v => {
          setValue(v);
        }}
        placeholder={placeholder}
        skipRegularStyles
        style={[localStyles.iwbInput, extraStyles?.input]}
        {...props}
      />
      <Button
        onPress={() => {
          if (!value && cannotBeEmpty) {
            showToast(emptyError!);
          } else {
            if (!skipIfSame || (skipIfSame && value !== defaultValue)) {
              onPress(value);
            }
          }
        }}
        style={[localStyles.iwbButton, extraStyles?.button]}>
        {buttonContents.type === 'string' ? (
          <Text style={{color: currentTheme.foregroundPrimary}}>
            {buttonContents.content}
          </Text>
        ) : buttonContents.pack === 'regular' ? (
          <MaterialIcon
            name={buttonContents.name}
            color={currentTheme.foregroundPrimary}
            size={20}
          />
        ) : (
          <MaterialCommunityIcon
            name={buttonContents.name}
            color={currentTheme.foregroundPrimary}
            size={20}
          />
        )}
      </Button>
    </View>
  );
}

export function InputWithButtonV2({
  inputProps,
  buttonProps,
  callback,
  vertical,
  containerStyles,
  inputStyles,
  buttonStyles,
  skipIfSame,
  cannotBeEmpty,
  emptyError,
}: {
  inputProps?: Omit<TextInputProps, 'style'>;
  buttonProps?: Omit<PressableProps, 'onPress' | 'style'>;
  callback: (v: string | undefined) => void;
  vertical?: boolean;
  containerStyles?: ViewStyle;
  inputStyles?: TextStyle;
  buttonStyles?: ViewStyle;
  skipIfSame?: boolean;
  cannotBeEmpty?: boolean;
  emptyError?: string;
}) {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  const [value, setValue] = useState(inputProps?.defaultValue);

  return (
    <View
      style={[
        localStyles.iwbContainerV2,
        vertical && localStyles.iwbContainerV2Vertical,
        containerStyles,
      ]}>
      <Input
        value={value}
        onChangeText={v => {
          setValue(v);
        }}
        skipRegularStyles
        style={[localStyles.iwbInputV2, inputStyles]}
        {...inputProps}
      />
      <Pressable
        onPress={() => {
          if (!value && cannotBeEmpty) {
            showToast(emptyError!);
          } else {
            if (
              !skipIfSame ||
              (skipIfSame && value !== inputProps?.defaultValue)
            ) {
              callback(value);
            }
          }
        }}
        style={[
          localStyles.iwbButtonV2,
          vertical
            ? localStyles.iwbButtonV2Vertical
            : localStyles.iwbButtonV2Horizontal,
          buttonStyles,
        ]}
        {...buttonProps}
      />
    </View>
  );
}

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    iwbContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '100%',
    },
    iwbInput: {
      flex: 1,
      padding: commonValues.sizes.large,
    },
    iwbButton: {
      marginRight: 0,
      backgroundColor: currentTheme.backgroundSecondary,
    },
    iwbContainerV2: {
      flexDirection: 'row',
      borderRadius: commonValues.sizes.medium,
      backgroundColor: currentTheme.backgroundPrimary,
    },
    iwbContainerV2Vertical: {
      flexDirection: 'column',
    },
    iwbInputV2: {
      backgroundColor: '#00000000',
      padding: commonValues.sizes.large,
      flex: 1,
    },
    iwbButtonV2: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    iwbButtonV2Horizontal: {
      paddingInline: commonValues.sizes.large,
      flexDirection: 'row',
      borderStartWidth: commonValues.sizes.xs,
      borderStartColor: currentTheme.backgroundSecondary,
    },
    iwbButtonV2Vertical: {
      paddingBlock: commonValues.sizes.large,
      flexDirection: 'column',
      borderTopWidth: commonValues.sizes.xs,
      borderTopColor: currentTheme.backgroundSecondary,
    },
  });
};
