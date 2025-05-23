import {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import MaterialIcon from '@react-native-vector-icons/material-icons';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';

import type {Member, Server} from 'revolt.js';

import {app, settings} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {styles} from '@clerotri/Theme';
import {SERVER_FLAGS, SPECIAL_SERVERS} from '@clerotri/lib/consts';
import {ChannelContext} from '@clerotri/lib/state';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';
import {
  ContextButton,
  CopyIDButton,
  GeneralAvatar,
  Text,
} from '../common/atoms';
import {MarkdownView} from '../common/MarkdownView';
import {Image} from '@clerotri/crossplat/Image';

export const ServerInfoSheet = observer(({server}: {server: Server | null}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {currentChannel, setCurrentChannel} = useContext(ChannelContext);

  const [members, setMembers] = useState(null as Member[] | null);

  useEffect(() => {
    async function fetchMembers() {
      if (!server || server._id === SPECIAL_SERVERS.lounge.id) {
        return;
      }
      // const start = new Date().getTime();
      // console.log(`[SERVERINFOSHEET] Fetching members... (${start})`);
      const m = await server.fetchMembers();
      // const mid = new Date().getTime();
      // console.log(`[SERVERINFOSHEET] Fetched members (${mid})`);
      setMembers(m.members);
      // const end = new Date().getTime();
      // console.log(`[SERVERINFOSHEET] Set members (${end})`);
    }
    fetchMembers();
  }, [server]);

  return (
    <View style={{paddingHorizontal: 16}}>
      {!server ? (
        <></>
      ) : (
        <>
          <View style={{justifyContent: 'center'}}>
            {server.banner ? (
              <Image
                source={{uri: server.generateBannerURL()}}
                style={{width: '100%', height: 120, marginBottom: 8}}
              />
            ) : null}
            {server.icon ? (
              <GeneralAvatar attachment={server.icon} size={72} />
            ) : null}
            <View style={{flexDirection: 'row'}}>
              {server.flags === SERVER_FLAGS.Official ? (
                <TouchableOpacity
                  onPress={() => showToast('Official Server')}
                  style={{alignSelf: 'center', marginEnd: 4}}>
                  <MaterialCommunityIcon
                    name={'crown'}
                    color={currentTheme.foregroundPrimary}
                    size={24}
                  />
                </TouchableOpacity>
              ) : server.flags === SERVER_FLAGS.Verified ? (
                <TouchableOpacity
                  onPress={() => showToast('Verified Server')}
                  style={{alignSelf: 'center', marginEnd: 4}}>
                  <MaterialIcon
                    name={'verified'}
                    color={currentTheme.foregroundPrimary}
                    size={24}
                  />
                </TouchableOpacity>
              ) : null}
              <Text
                type={'h1'}
                style={{
                  fontSize: 24,
                }}>
                {server.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                showToast(
                  server.discoverable
                    ? 'Anyone can join this server.'
                    : 'You need an invite to join this server.',
                )
              }
              style={{flexDirection: 'row'}}>
              <MaterialIcon
                name={server.discoverable ? 'public' : 'home'}
                color={currentTheme.foregroundSecondary}
                size={20}
                style={{
                  alignSelf: 'center',
                  marginEnd: commonValues.sizes.small,
                }}
              />
              <Text
                colour={currentTheme.foregroundSecondary}
                style={{alignSelf: 'center'}}>
                {server.discoverable ? 'Public server' : 'Invite-only server'}
              </Text>
            </TouchableOpacity>
            <Text
              colour={currentTheme.foregroundSecondary}
              style={{
                marginVertical: commonValues.sizes.small,
              }}>
              {server._id === SPECIAL_SERVERS.lounge.id
                ? 'Member count disabled for this server'
                : members
                  ? `${members.length} ${
                      members.length === 1 ? 'member' : 'members'
                    }`
                  : 'Fetching member count...'}
            </Text>
            {server.description ? (
              <View
                style={{
                  backgroundColor: currentTheme.background,
                  padding: commonValues.sizes.xl,
                  borderRadius: commonValues.sizes.medium,
                }}>
                <MarkdownView>{server.description}</MarkdownView>
              </View>
            ) : null}
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {server.havePermission('ManageServer') ? (
              <ContextButton
                key={'server-ctx-menu-settings'}
                onPress={() => {
                  app.openServerSettings(server);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name={'settings'}
                    size={20}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
                <Text>Server Settings</Text>
              </ContextButton>
            ) : null}
            {settings.get('ui.showDeveloperFeatures') ? (
              <CopyIDButton id={server._id} />
            ) : null}
            {server.owner !== client.user?._id ? (
              <>
                <ContextButton
                  key={'server-ctx-menu-report'}
                  onPress={() => {
                    app.openReportMenu({object: server, type: 'Server'});
                  }}>
                  <View style={styles.iconContainer}>
                    <MaterialIcon
                      name="flag"
                      size={20}
                      color={currentTheme.error}
                    />
                  </View>
                  <Text colour={currentTheme.error}>Report Server</Text>
                </ContextButton>
                <ContextButton
                  key={'server-ctx-menu-leave'}
                  onPress={async () => {
                    app.openServer();
                    app.openServerContextMenu(null);
                    if (
                      typeof currentChannel !== 'string' &&
                      currentChannel?.server?._id === server?._id
                    ) {
                      setCurrentChannel(null);
                    }
                    await server.delete();
                  }}>
                  <View style={styles.iconContainer}>
                    <MaterialIcon
                      name="exit-to-app"
                      size={20}
                      color={currentTheme.error}
                    />
                  </View>
                  <Text colour={currentTheme.error}>Leave Server</Text>
                </ContextButton>
              </>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
});
