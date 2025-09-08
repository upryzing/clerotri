import {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {Text} from '@clerotri/components/common/atoms';
import {commonValues, type Theme, ThemeContext} from '@clerotri/lib/themes';
import type {ContextButtonProps} from '@clerotri/lib/types';
import {styles} from '@clerotri/Theme';

export const NewContextButton = ({
  type,
  icon,
  textString,
  textColour,
  backgroundColor,
  style,
  ...props
}: ContextButtonProps) => {
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
      {icon && (
        <View style={styles.iconContainer}>
          {icon.pack === 'regular' ? (
            <MaterialIcon
              name={icon.name}
              color={icon.colour ?? currentTheme.foregroundPrimary}
              size={24}
            />
          ) : (
            <MaterialCommunityIcon
              name={icon.name}
              color={icon.colour ?? currentTheme.foregroundPrimary}
              size={24}
            />
          )}
        </View>
      )}
      {textString && (
        <Text colour={textColour ?? currentTheme.foregroundPrimary}>
          {t(textString)}
        </Text>
      )}
      {props.children}
    </TouchableOpacity>
  );
};

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    common: {
      flex: 1,
      backgroundColor: currentTheme.backgroundPrimary,
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
