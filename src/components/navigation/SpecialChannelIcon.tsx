import {useContext} from 'react';

import MaterialIcon from '@react-native-vector-icons/material-icons';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';

import {ThemeContext} from '@clerotri/lib/themes';

type SpecialCIChannel =
  | 'Home'
  | 'Friends'
  | 'Saved Notes'
  | 'Discover'
  | 'Debug';

export const SpecialChannelIcon = ({channel}: {channel: SpecialCIChannel}) => {
  const {currentTheme} = useContext(ThemeContext);

  const color = currentTheme.foregroundSecondary;
  switch (channel) {
    case 'Home':
      return <MaterialIcon name="home" size={24} color={color} />;
    case 'Friends':
      return <MaterialIcon name="group" size={24} color={color} />;
    case 'Saved Notes':
      return <MaterialIcon name="sticky-note-2" size={24} color={color} />;
    case 'Discover':
      return <MaterialCommunityIcon name="compass" size={24} color={color} />;
    case 'Debug':
      return <MaterialIcon name="bug-report" size={24} color={color} />;
    default:
      return <></>;
  }
};
