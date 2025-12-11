import {Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';

import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';
import {styles} from '@clerotri/Theme';
import {Setting} from '@clerotri/lib/types';
import {showToast} from '@clerotri/lib/utils';

export const IndicatorIcons = ({s}: {s: Setting}) => {
  const {t} = useTranslation();

  return (
    <>
      {s.deprecated ? (
        <Pressable
          onPress={() => showToast(t('app.settings_menu.toasts.deprecated'))}
          style={styles.iconContainer}>
          <MaterialIcon name="warning" size={28} color={'error'} />
        </Pressable>
      ) : null}
      {s.experimental ? (
        <Pressable
          onPress={() => showToast(t('app.settings_menu.toasts.experimental'))}
          style={styles.iconContainer}>
          <MaterialCommunityIcon name="flask" size={28} color={'accentColor'} />
        </Pressable>
      ) : null}
      {s.developer ? (
        <Pressable
          onPress={() => showToast(t('app.settings_menu.toasts.developer'))}
          style={styles.iconContainer}>
          <MaterialIcon name="bug-report" size={28} color={'accentColor'} />
        </Pressable>
      ) : null}
    </>
  );
};
