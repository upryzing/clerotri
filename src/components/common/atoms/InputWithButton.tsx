import {useContext, useState} from 'react';
import {StyleSheet, type TextStyle, View, type ViewStyle} from 'react-native';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        cursorColor={currentTheme.accentColor}
        selectionHandleColor={currentTheme.accentColor}
        selectionColor={`${currentTheme.accentColor}60`}
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
  });
};
