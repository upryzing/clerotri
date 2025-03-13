import {useContext, useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import MaterialIcon from '@react-native-vector-icons/material-icons';

import type {API, Server} from 'revolt.js';

// import {app} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms';
import {SettingsEntry} from '@clerotri/components/common/settings/atoms';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const InviteSettingsSection = observer(({server}: {server: Server}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const [reload, triggerReload] = useState(0);
  const [invites, setInvites] = useState(null as API.Invite[] | null);
  useEffect(() => {
    async function fetchInvites() {
      const i = await server.fetchInvites();
      setInvites(i);
    }

    fetchInvites();
  }, [server, reload]);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: commonValues.sizes.medium,
        }}>
        <View style={{flex: 1}}>
          <Text type={'h1'}>{t('app.servers.settings.invites.title')}</Text>
        </View>
        {/* TODO: add channel selector
        {server.havePermission('InviteOthers') ? (
          <Pressable
            onPress={() => {
              app.openCreateChannelModal({
                server,
                callback: () => {},
              });
            }}
            style={{
              width: 30,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={styles.iconContainer}>
              <MaterialIcon
                name={'add'}
                size={20}
                color={currentTheme.foregroundPrimary}
              />
            </View>
          </Pressable>
        ) : null} */}
      </View>
      {invites ? (
        invites.length ? (
          invites.map(i => (
            <SettingsEntry key={`invite-settings-entry-${i._id}`}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Text
                  key={`invite-settings-entry-${i._id}-id`}
                  style={{fontWeight: 'bold'}}>
                  {i._id}
                </Text>
                <Text colour={currentTheme.foregroundSecondary}>
                  @{i.creator} - #{i.channel}
                </Text>
              </View>
              {server.havePermission('ManageServer') && i._id.length === 8 ? (
                <Pressable
                  style={{
                    width: 30,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    server.client.deleteInvite(i._id);
                    triggerReload(reload + 1);
                  }}>
                  <View style={styles.iconContainer}>
                    <MaterialIcon
                      name={'delete'}
                      size={20}
                      color={currentTheme.foregroundPrimary}
                    />
                  </View>
                </Pressable>
              ) : null}
            </SettingsEntry>
          ))
        ) : (
          <Text>{t('app.servers.settings.invites.empty')}</Text>
        )
      ) : (
        <Text>{t('app.servers.settings.invites.loading')}</Text>
      )}
    </>
  );
});
