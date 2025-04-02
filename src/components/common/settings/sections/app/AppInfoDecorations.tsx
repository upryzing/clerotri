import {type GradientValue} from 'react-native';

import {getBundleId} from 'react-native-device-info';

import ReleaseIcon from '../../../../../../assets/images/icon_release.svg';
import DebugIcon from '../../../../../../assets/images/icon_debug.svg';

export const isDebug = getBundleId().match('debug');

export const AppIcon = isDebug ? DebugIcon : ReleaseIcon;

const versionGradient: GradientValue = {
  type: 'linearGradient',
  direction: '90deg',
  colorStops: [
    {color: isDebug ? '#d3bc5f80' : '#0ad3c1a0'},
    {color: isDebug ? '#a4801f80' : '#f30f77a0'},
  ],
};

export const GradientStyle = {experimental_backgroundImage: [versionGradient]};
