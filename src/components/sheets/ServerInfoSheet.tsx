import {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type {Member, Server} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {settings} from '@clerotri/lib/settings';
import {client} from '@clerotri/lib/client';
import {SERVER_FLAGS, SPECIAL_SERVERS} from '@clerotri/lib/consts';
import {ChannelContext} from '@clerotri/lib/state';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';
import {GeneralAvatar, Text} from '../common/atoms';
import {
  CopyIDButton,
  NewContextButton,
} from '@clerotri/components/common/buttons';
import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';
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
                  <MaterialCommunityIcon name={'crown'} size={24} />
                </TouchableOpacity>
              ) : server.flags === SERVER_FLAGS.Verified ? (
                <TouchableOpacity
                  onPress={() => showToast('Verified Server')}
                  style={{alignSelf: 'center', marginEnd: 4}}>
                  <MaterialIcon name={'verified'} size={24} />
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
                color={'foregroundSecondary'}
                size={20}
                style={{
                  alignSelf: 'center',
                  marginEnd: commonValues.sizes.small,
                }}
              />
              <Text
                useNewText
                colour={'foregroundSecondary'}
                style={{alignSelf: 'center'}}>
                {server.discoverable ? 'Public server' : 'Invite-only server'}
              </Text>
            </TouchableOpacity>
            <Text
              useNewText
              colour={'foregroundSecondary'}
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
                  marginBlockEnd: commonValues.sizes.medium,
                }}>
                <MarkdownView>{server.description}</MarkdownView>
              </View>
            ) : null}
          </View>
          <View>
            {server.havePermission('ManageServer') ? (
              <NewContextButton
                key={'server-ctx-menu-settings'}
                type={'detatched'}
                icon={{pack: 'regular', name: 'settings'}}
                textString={'Server Settings'}
                onPress={() => {
                  app.openServerSettings(server);
                }}
              />
            ) : null}
            {settings.get('ui.showDeveloperFeatures') ? (
              <CopyIDButton itemID={server._id} type={'detatched'} />
            ) : null}
            {server.owner !== client.user?._id ? (
              <>
                <NewContextButton
                  key={'server-ctx-menu-report'}
                  type={'start'}
                  icon={{
                    pack: 'regular',
                    name: 'flag',
                    colour: 'error',
                  }}
                  textString={'Report Server'}
                  textColour={currentTheme.error}
                  onPress={() => {
                    app.openReportMenu({object: server, type: 'Server'});
                  }}
                />
                <NewContextButton
                  key={'server-ctx-menu-leave'}
                  type={'end'}
                  icon={{
                    pack: 'regular',
                    name: 'exit-to-app',
                    colour: 'error',
                  }}
                  textString={'Leave Server'}
                  textColour={currentTheme.error}
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
                  }}
                />
              </>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
});
