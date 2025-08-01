import {useContext} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms';
import {ExpandableProfile} from '@clerotri/components/common/profile';
import {
  PressableSettingsEntry,
  SettingsEntry,
} from '@clerotri/components/common/settings/atoms';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const ProfileSettingsSection = observer(() => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  return (
    <>
      <ExpandableProfile user={client.user!} />
      <SettingsEntry
        key={'display-name-settings'}
        style={{marginBlockStart: commonValues.sizes.medium}}>
        <View style={{flex: 1}}>
          <Text key={'display-name-label'} style={{fontWeight: 'bold'}}>
            {t('app.settings_menu.profile.display_name')}
          </Text>
          <Text
            key={'display-name'}
            colour={
              client.user?.display_name
                ? currentTheme.foregroundPrimary
                : currentTheme.foregroundSecondary
            }>
            {client.user?.display_name ?? 'No display name set'}
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
            Clipboard.setString(
              client.user?.display_name ?? 'No display name set',
            );
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name="content-copy"
              size={20}
              color={currentTheme.foregroundPrimary}
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
            app.openTextEditModal({
              initialString: client.user?.display_name ?? '',
              id: 'display_name',
              callback: newName => {
                client.api.patch('/users/@me', {display_name: newName});
              },
            });
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name="edit"
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </View>
        </Pressable>
      </SettingsEntry>
      <PressableSettingsEntry
        key={'status-settings-link'}
        onPress={() => {
          app.openSettings(false);
          app.openStatusMenu(true);
        }}>
        <View style={{flex: 1}}>
          <Text key={'status-settings-link-label'} style={{fontWeight: 'bold'}}>
            {t('app.settings_menu.profile.status')}
          </Text>
          <Text
            key={'status-settings-link-body'}
            colour={currentTheme.foregroundPrimary}>
            {t('app.settings_menu.profile.status_body')}
          </Text>
        </View>
        <View
          style={{
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name={'arrow-forward'}
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </View>
        </View>
      </PressableSettingsEntry>
    </>
  );
});
