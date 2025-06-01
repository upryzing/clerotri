import {Platform} from 'react-native';

import {
  getApiLevelSync,
  getBaseOsSync,
  getBrand,
  getDeviceSync,
  getUserAgentSync,
} from 'react-native-device-info';

import {storage} from '@clerotri/lib/storage';
import {appVersion} from '@clerotri/Generic';
import {getInstanceURL} from '@clerotri/lib/storage/utils';

export const generateAnalyticsObject = (tier: 'basic' | 'full') => {
  // basic
  const deviceModel =
    Platform.OS === 'android'
      ? `${getBrand()}/${getDeviceSync()}`
      : Platform.OS === 'web'
        ? `${getUserAgentSync()}`
        : 'N/A';
  const osVersion =
    Platform.OS === 'android'
      ? `Android (API ${getApiLevelSync()})`
      : Platform.OS === 'web'
        ? `Web (${getBaseOsSync})`
        : 'N/A';
  const clerotriVersion = `v${appVersion}`;

  // full
  const settings = tier === 'full' ? storage.getString('settings') : null;
  const instanceURL = tier === 'full' ? getInstanceURL() : null;

  return {
    tier,
    model: deviceModel,
    os: osVersion,
    version: clerotriVersion,
    ...(tier === 'full' && {
      settings,
      instance: instanceURL,
    }),
  };
};
