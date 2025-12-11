import {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {Text} from '@clerotri/components/common/atoms';
import {MaterialCommunityIcon, MaterialIcon} from '@clerotri/components/common/icons';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
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
              customColor={icon.customColour}
              color={icon.colour ?? 'foregroundPrimary'}
              size={24}
            />
          ) : (
            <MaterialCommunityIcon
              name={icon.name}
              customColor={icon.customColour}
              color={icon.colour ?? 'foregroundPrimary'}
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

const localStyles = StyleSheet.create(currentTheme => ({
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
}));
