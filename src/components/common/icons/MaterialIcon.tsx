import {withUnistyles} from 'react-native-unistyles';

import MaterialIconCore from '@react-native-vector-icons/material-icons';

import type {MaterialIconProps} from '@clerotri/lib/types';

const MaterialIconWithUnistyles = withUnistyles(MaterialIconCore);

export const MaterialIcon = (props: MaterialIconProps) => {
  const {color, customColor, ...newProps} = props;

  return (
    <MaterialIconWithUnistyles
      uniProps={currentTheme => ({
        color: customColor ?? currentTheme[color ?? 'foregroundPrimary'],
      })}
      {...newProps}
    />
  );
};
