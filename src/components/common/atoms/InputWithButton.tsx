import {useState} from 'react';
import {
  Pressable,
  type PressableProps,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {Input} from '@clerotri/components/common/atoms/Input';
import {commonValues} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

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

const localStyles = StyleSheet.create(currentTheme => ({
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
}));
