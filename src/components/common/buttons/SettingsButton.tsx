import {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import MaterialCommunityIcon, {
  type MaterialDesignIconsIconName,
} from '@react-native-vector-icons/material-design-icons';
import MaterialIcon, {
  type MaterialIconsIconName,
} from '@react-native-vector-icons/material-icons';

import {Text} from '@clerotri/components/common/atoms';
import {commonValues, type Theme, ThemeContext} from '@clerotri/lib/themes';
import type {ButtonProps} from '@clerotri/lib/types';
import {styles} from '@clerotri/Theme';

type SettingsButtonProps = ButtonProps & {
  menu: 'app' | 'app-other' | 'server';
  section: string;
  type?: 'start' | 'end' | 'detatched';
  icon:
    | {
        name: MaterialIconsIconName;
        pack: 'regular';
      }
    | {
        name: MaterialDesignIconsIconName;
        pack: 'community';
      };
};

export const SettingsButton = ({
  menu,
  section,
  type,
  icon,
  backgroundColor,
  style,
  ...props
}: SettingsButtonProps) => {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  const {t} = useTranslation();

  return (
    <TouchableOpacity
      style={[
        localStyles.common,
        type && type !== 'end' && localStyles.start,
        type && type !== 'start' && localStyles.end,
        backgroundColor && {backgroundColor},
        style,
      ]}
      {...props}>
      <View style={styles.iconContainer}>
        {icon.pack === 'regular' ? (
          <MaterialIcon
            name={icon.name}
            color={
              section === 'logout' || section === 'delete_server'
                ? currentTheme.error
                : currentTheme.foregroundPrimary
            }
            size={24}
          />
        ) : (
          <MaterialCommunityIcon
            name={icon.name}
            color={
              section === 'donate'
                ? currentTheme.accentColor
                : currentTheme.foregroundPrimary
            }
            size={24}
          />
        )}
      </View>
      <Text
        colour={
          section === 'logout' || section === 'delete_server'
            ? currentTheme.error
            : currentTheme.foregroundPrimary
        }>
        {t(
          `app.${menu === 'server' ? 'servers.settings' : 'settings_menu'}.${section === 'delete_server' ? 'delete_server' : menu === 'app-other' ? `other.${section}` : `${section}.title`}`,
        )}
      </Text>
    </TouchableOpacity>
  );
};

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    common: {
      flex: 1,
      backgroundColor: currentTheme.backgroundSecondary,
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: commonValues.sizes.small,
      paddingInline: commonValues.sizes.large,
      paddingBlock: commonValues.sizes.medium,
      marginBlock: commonValues.sizes.xs,
    },
    start: {
      borderStartStartRadius: commonValues.sizes.medium,
      borderEndStartRadius: commonValues.sizes.medium,
    },
    end: {
      borderStartEndRadius: commonValues.sizes.medium,
      borderEndEndRadius: commonValues.sizes.medium,
      marginBlockEnd: commonValues.sizes.medium,
    },
  });
};
