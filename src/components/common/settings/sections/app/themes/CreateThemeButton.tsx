import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {MaterialIcon} from '@clerotri/components/common/icons';
import {commonValues} from '@clerotri/lib/themes';

export const CreateThemeButton = ({onPress}: {onPress: () => void}) => {
  return (
    <Pressable style={{alignItems: 'center'}} onPress={() => onPress()}>
      <View style={localStyles.background}>
        <MaterialIcon name={'add'} size={40} color={'foregroundSecondary'} />
      </View>
    </Pressable>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  background: {
    height: 80,
    width: 60,
    borderRadius: commonValues.sizes.medium,
    outlineColor: currentTheme.foregroundSecondary,
    outlineWidth: commonValues.sizes.xs,
    outlineStyle: 'dashed',
    outlineOffset: -2,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
