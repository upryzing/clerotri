import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {Text} from '@clerotri/components/common/atoms';
import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';
import {commonValues} from '@clerotri/lib/themes';
import type {ContextButtonProps, ThemeColour} from '@clerotri/lib/types';
import {styles} from '@clerotri/Theme';

export const NewContextButton = ({
  type,
  icon,
  textString,
  textColour,
  textCustomColour,
  backgroundColour,
  backgroundCustomColour,
  style,
  ...props
}: ContextButtonProps) => {
  const {t} = useTranslation();

  return (
    <TouchableOpacity
      style={[
        localStyles.common,
        type && type !== 'end' && localStyles.start,
        type && type !== 'start' && localStyles.end,
        localStyles.backgroundColour(
          backgroundCustomColour
            ? {type: 'custom', value: backgroundCustomColour}
            : {type: 'theme', value: backgroundColour ?? 'backgroundPrimary'},
        ),
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
      {textString &&
        (textColour ? (
          <Text useNewText colour={textColour}>
            {t(textString)}
          </Text>
        ) : (
          <Text useNewText customColour={textCustomColour}>
            {t(textString)}
          </Text>
        ))}
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
  backgroundColour: ({
    type,
    value,
  }: {type: 'custom'; value: any} | {type: 'theme'; value: ThemeColour}) => ({
    backgroundColor: type === 'custom' ? value : currentTheme[value],
  }),
}));
