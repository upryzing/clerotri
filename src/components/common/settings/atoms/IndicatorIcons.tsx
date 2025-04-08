import {useContext} from 'react';
import {Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';

import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {styles} from '@clerotri/Theme';
import {ThemeContext} from '@clerotri/lib/themes';
import {Setting} from '@clerotri/lib/types';
import {showToast} from '@clerotri/lib/utils';

export const IndicatorIcons = ({s}: {s: Setting}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  return (
    <>
      {s.deprecated ? (
        <Pressable
          onPress={() => showToast(t('app.settings_menu.toasts.deprecated'))}
          style={styles.iconContainer}>
          <MaterialIcon name="warning" size={28} color={currentTheme.error} />
        </Pressable>
      ) : null}
      {s.experimental ? (
        <Pressable
          onPress={() => showToast(t('app.settings_menu.toasts.experimental'))}
          style={styles.iconContainer}>
          <MaterialCommunityIcon
            name="flask"
            size={28}
            color={currentTheme.accentColor}
          />
        </Pressable>
      ) : null}
      {s.developer ? (
        <Pressable
          onPress={() => showToast(t('app.settings_menu.toasts.developer'))}
          style={styles.iconContainer}>
          <MaterialIcon
            name="bug-report"
            size={28}
            color={currentTheme.accentColor}
          />
        </Pressable>
      ) : null}
    </>
  );
};
