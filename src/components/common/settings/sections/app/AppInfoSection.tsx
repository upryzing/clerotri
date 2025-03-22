import {useContext} from 'react';
import {Pressable, View} from 'react-native';

import {getBundleId} from 'react-native-device-info';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';

import {appVersion, settings} from '@clerotri/Generic';
import {
  CONTRIBUTORS_LIST,
  FEDI_PROFILE,
  GITHUB_REPO,
} from '@clerotri/lib/consts';
import {
  BUILD_COMMIT,
  REACT_NATIVE_VERSION,
  REVOLT_JS_VERSION,
} from '@clerotri/lib/metadata';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {openUrl} from '@clerotri/lib/utils';
import {ContextButton, Link, Text} from '@clerotri/components/common/atoms';
import {
  AppIcon,
  GradientStyle,
} from '@clerotri/components/common/settings/sections/app/AppInfoDecorations';

const isDebug = getBundleId().match('debug');

export const AppInfoSection = () => {
  const {currentTheme} = useContext(ThemeContext);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{alignItems: 'center'}}>
        <AppIcon height={250} width={250} />
      </View>
      <View style={{alignItems: 'center', marginVertical: 16}}>
        <View
          style={[
            {
              borderRadius: commonValues.sizes.medium,
              paddingInline: commonValues.sizes.medium,
              paddingBlockStart: commonValues.sizes.small,
              marginBlockEnd: commonValues.sizes.small,
            },
            GradientStyle,
          ]}>
          <Text type={'h1'}>
            Clerotri{' '}
            <Text colour={currentTheme.foregroundSecondary}>
              {isDebug ? 'Debug ' : ''}v{appVersion}
            </Text>
          </Text>
        </View>
        <Text colour={currentTheme.foregroundSecondary}>
          commit{' '}
          <Link
            link={`${GITHUB_REPO}/commit/${BUILD_COMMIT}`}
            label={BUILD_COMMIT.slice(0, 9)}
            style={{fontFamily: 'JetBrains Mono'}}
          />
        </Text>
        <Text>
          Powered by{' '}
          <Link link={'https://reactnative.dev'} label={'React Native'} /> v
          {REACT_NATIVE_VERSION}
          {' and '}
          <Link
            link={'https://github.com/rexogamer/revolt.js'}
            label={'revolt.js'}
          />{' '}
          v{REVOLT_JS_VERSION}
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
          settings.clear();
        }}>
        <Text>Reset Settings</Text>
      </ContextButton>
    </View>
  );
};
