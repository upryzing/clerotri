import {useContext, useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';

import {client} from '@clerotri/lib/client';
import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {GapView} from '@clerotri/components/layout';
import {SettingsEntry} from '@clerotri/components/common/settings/atoms';
import {ThemeContext} from '@clerotri/lib/themes';

export const AccountSettingsSection = observer(() => {
  const {currentTheme} = useContext(ThemeContext);

  const [authInfo, setAuthInfo] = useState({
    email: '',
    mfaEnabled: false,
  });
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    async function getAuthInfo() {
      const e = await client.api.get('/auth/account/');
      const m = await client.api.get('/auth/mfa/');

      setAuthInfo({
        email: e.email,
        mfaEnabled: m.totp_mfa ?? m.security_key_mfa ?? false,
      });
    }
    getAuthInfo();
  }, []);

  return (
    <>
      <SettingsEntry key={'username-settings'}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <Text key={'username-label'} style={{fontWeight: 'bold'}}>
            Username{' '}
          </Text>
          <Text key={'username'}>
            {client.user?.username}
            <Text colour={currentTheme.foregroundSecondary}>
              #{client.user?.discriminator}
            </Text>
          </Text>
        </View>
        <Pressable
          style={{
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            Clipboard.setString(client.user?.username!);
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name="content-copy"
              size={20}
            />
          </View>
        </Pressable>
        {/* <Pressable
      style={{
        width: 30,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={async () => {}}>
      <View style={styles.iconContainer}>
        <MaterialIcon
          name="edit"
          size={20}
        />
      </View>
    </Pressable> */}
      </SettingsEntry>
      <SettingsEntry key={'email-settings'}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <Text key={'email-label'} style={{fontWeight: 'bold'}}>
            Email
          </Text>
          <Text key={'email'}>
            {showEmail ? authInfo.email : '•••••••••••@••••••.•••'}
          </Text>
        </View>
        <Pressable
          style={{
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setShowEmail(!showEmail);
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name={showEmail ? 'visibility-off' : 'visibility'}
              size={20}
            />
          </View>
        </Pressable>
        <Pressable
          style={{
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            Clipboard.setString(authInfo.email);
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name="content-copy"
              size={20}
            />
          </View>
        </Pressable>
        {/* <Pressable
      style={{
        width: 30,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={async () => {}}>
      <View style={styles.iconContainer}>
        <MaterialIcon
          name="edit"
          size={20}
          color={currentTheme.foregroundPrimary}
        />
      </View>
    </Pressable> */}
      </SettingsEntry>
      <GapView size={4} />
      <Text type={'h1'}>Multi-factor authentication</Text>
      <Text
        style={{
          color: currentTheme.foregroundSecondary,
        }}>
        Make your account more secure by enabling multi-factor authentication
        (MFA).
      </Text>
      <GapView size={2} />
      <Text type={'h2'}>Status</Text>
      <Text>
        MFA is currently {authInfo.mfaEnabled ? 'enabled' : 'disabled'}.
      </Text>
    </>
  );
});
