import {TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {MaterialIcon} from '@clerotri/components/common/icons';
import {commonValues} from '@clerotri/lib/themes';

export const Checkbox = ({
  value,
  callback,
}: {
  value: boolean;
  callback: any;
}) => {
  return (
    <TouchableOpacity
      style={[localStyles.base, value && localStyles.active]}
      onPress={callback}>
      {value ? (
        <MaterialIcon
          name="check"
          color={'accentColorForeground'}
          size={24}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  base: {
    width: 40,
    height: 40,
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: currentTheme.accentColor
  },
}));
