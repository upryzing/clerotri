import {withUnistyles} from 'react-native-unistyles';

import MaterialCommunityIconCore from '@react-native-vector-icons/material-design-icons';

import type {MaterialCommunityIconProps} from '@clerotri/lib/types';

const MaterialCommunityIconWithUnistyles = withUnistyles(
  MaterialCommunityIconCore,
);

export const MaterialCommunityIcon = (props: MaterialCommunityIconProps) => {
  const {color, customColor, ...newProps} = props;

  return (
    <MaterialCommunityIconWithUnistyles
      uniProps={currentTheme => ({
        color: customColor ?? currentTheme[color ?? 'foregroundPrimary'],
      })}
      {...newProps}
    />
  );
};
