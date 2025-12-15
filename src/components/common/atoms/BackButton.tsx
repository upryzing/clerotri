import {Pressable, type ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from './Text';
import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';

export function BackButton({
  callback,
  type,
  margin,
  label,
  style,
}: {
  callback: () => void;
  type?: 'back' | 'close';
  margin?: boolean;
  label?: string;
  style?: ViewStyle;
}) {
  const {t} = useTranslation();
  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: margin ? 10 : 0,
        ...style,
      }}
      onPress={() => {
        callback();
      }}>
      {type === 'close' ? (
        <MaterialCommunityIcon
          name="close-circle"
          size={24}
          color={'foregroundSecondary'}
        />
      ) : (
        <MaterialIcon
          name={'arrow-back'}
          size={24}
          color={'foregroundSecondary'}
        />
      )}
      <Text
        useNewText
        colour={'foregroundSecondary'}
        style={{
          fontSize: 20,
          marginLeft: 5,
        }}>
        {t(
          (label ?? type === 'close')
            ? 'app.actions.close'
            : 'app.actions.back',
        )}
      </Text>
    </Pressable>
  );
}
