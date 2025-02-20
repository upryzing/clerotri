import {useContext, useMemo} from 'react';
import {type GradientValue, Platform, Pressable, View} from 'react-native';

import {getBundleId} from 'react-native-device-info';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {dependencies} from '../../../../../../package.json';
import {app} from '@clerotri/Generic';
import {
  CONTRIBUTORS_LIST,
  FEDI_PROFILE,
  GITHUB_REPO,
} from '@clerotri/lib/consts';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {openUrl} from '@clerotri/lib/utils';
import {ContextButton, Link, Text} from '@clerotri/components/common/atoms';

import ReleaseIcon from '../../../../../../assets/images/icon_release.svg';
import DebugIcon from '../../../../../../assets/images/icon_debug.svg';

const isDebug = getBundleId().match('debug');

const AppIcon = isDebug ? DebugIcon : ReleaseIcon;

const versionGradient: GradientValue = {
  type: 'linearGradient',
  direction: '90deg',
  colorStops: [
    {color: isDebug ? '#d3bc5f80' : '#0ad3c1a0'},
    {color: isDebug ? '#a4801f80' : '#f30f77a0'},
  ],
};

export const AppInfoSection = () => {
  const {currentTheme} = useContext(ThemeContext);
  const reactNativeVersion = useMemo(
    () =>
      Platform.OS === 'web'
        ? dependencies['react-native'].replace('^', '')
        : `${Platform.constants.reactNativeVersion.major}.${
            Platform.constants.reactNativeVersion.minor
          }.${Platform.constants.reactNativeVersion.patch}${
            Platform.constants.reactNativeVersion.prerelease
              ? `-${Platform.constants.reactNativeVersion.prerelease}`
              : ''
          }`,
    [],
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {Platform.OS !== 'web' && (
        <View style={{alignItems: 'center'}}>
          <AppIcon height={250} width={250} />
        </View>
      )}
      <View style={{alignItems: 'center', marginVertical: 16}}>
        <View
          style={{
            experimental_backgroundImage: [versionGradient],
            borderRadius: commonValues.sizes.medium,
            paddingInline: commonValues.sizes.medium,
            paddingBlockStart: commonValues.sizes.small,
            marginBlockEnd: commonValues.sizes.small,
          }}>
          <Text type={'h1'}>
            Clerotri{' '}
            <Text colour={currentTheme.foregroundSecondary}>
              {isDebug ? 'Debug ' : ''}v{app.version}
            </Text>
          </Text>
        </View>
        <Text>
          Powered by{' '}
          <Link link={'https://reactnative.dev'} label={'React Native'} /> v
          {reactNativeVersion}
          {' and '}
          <Link
            link={'https://github.com/rexogamer/revolt.js'}
            label={'revolt.js'}
          />{' '}
          v{dependencies['revolt.js'].replace('npm:@rexovolt/revolt.js@^', '')}
        </Text>
        <Text>
          Made by{' '}
          <Link link={'https://github.com/TaiAurori'} label={'TaiAurori'} />,{' '}
          <Link link={'https://github.com/Rexogamer'} label={'Rexogamer'} /> and{' '}
          <Link link={CONTRIBUTORS_LIST} label={'other contributors'} />
        </Text>
        <Text>
          Licensed under the{' '}
          <Link
            link={`${GITHUB_REPO}/blob/main/LICENSE`}
            label={'GNU GPL v3.0'}
          />
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 16}}>
        <Pressable onPress={() => openUrl(GITHUB_REPO)} style={{marginEnd: 16}}>
          <MaterialCommunityIcon
            name={'github'}
            color={currentTheme.foregroundPrimary}
            size={60}
          />
        </Pressable>
        <Pressable
          onPress={() => openUrl(FEDI_PROFILE)}
          style={{marginStart: 16}}>
          <MaterialCommunityIcon
            name={'mastodon'}
            color={currentTheme.foregroundPrimary}
            size={60}
          />
        </Pressable>
      </View>
      <ContextButton
        backgroundColor={currentTheme.error}
        style={{
          justifyContent: 'center',
        }}
        onPress={() => {
          app.settings.clear();
        }}>
        <Text>Reset Settings</Text>
      </ContextButton>
    </View>
  );
};
