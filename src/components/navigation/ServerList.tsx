import {useContext, useMemo} from 'react';
import {Platform, Pressable, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import {LegendList} from '@legendapp/list/react-native';

import type {Server} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {Avatar, Text} from '@clerotri/components/common/atoms';
import {MaterialCommunityIcon} from '@clerotri/components/common/icons';
import {Image} from '@clerotri/crossplat/Image';
import {client} from '@clerotri/lib/client';
import {DEFAULT_API_URL} from '@clerotri/lib/consts';
import {OrderedServersContext, ServerContext} from '@clerotri/lib/state';
import {commonValues} from '@clerotri/lib/themes';
import {LineSeparator} from '../layout';
import {getInstanceURL} from '@clerotri/lib/storage/utils';

const ServerListEntry = observer(
  ({
    server,
    onServerPress,
    onServerLongPress,
    showUnread,
    isHorizontal,
  }: {
    server: Server;
    onServerPress: any;
    onServerLongPress?: any;
    showUnread?: boolean;
    isHorizontal?: boolean;
  }) => {
    const {currentServer} = useContext(ServerContext);

    const isCurrentServer = useMemo(
      () => server._id === currentServer?._id,
      [currentServer?._id, server._id],
    );

    const iconURL = server.generateIconURL();
    const pings = server.getMentions().length;
    let initials = '';

    for (const word of server.name.split(' ')) {
      initials += word.charAt(0);
    }

    return (
      <View key={`${server._id}-indicator-container`}>
        {!isHorizontal && isCurrentServer && (
          <View style={localStyles.selectedServerIndicator} />
        )}
        <TouchableOpacity
          onPress={() => {
            onServerPress(server);
          }}
          onLongPress={() => {
            onServerLongPress(server);
          }}
          key={server._id}
          style={[
            localStyles.serverButton(isHorizontal),
            isCurrentServer && localStyles.selectedServer,
          ]}>
          {iconURL ? (
            <Image
              key={`${server._id}-icon`}
              source={{uri: iconURL}}
              style={localStyles.serverIcon}
            />
          ) : (
            <Text
              key={`${server._id}-initials`}
              style={localStyles.serverButtonInitials}>
              {initials}
            </Text>
          )}
        </TouchableOpacity>
        {showUnread && pings > 0 ? (
          <View
            key={`${server._id}-mentions-indicator`}
            style={localStyles.mentionsIndicator(isHorizontal)}>
            <Text
              key={`${server._id}-mentions-indicator-count`}
              style={localStyles.mentionsIndicatorText}>
              {pings > 9 ? '9+' : pings}
            </Text>
          </View>
        ) : showUnread && server.isUnread() ? (
          <View
            key={`${server._id}-unreads-indicator`}
            style={localStyles.unreadsIndicator(isHorizontal)}
          />
        ) : null}
      </View>
    );
  },
);

type ListEntry = 'user' | Server | 'separator' | 'discover';

type EntriesArray = ListEntry[];

const orderServers = (
  unorderedServers: Server[],
  orderedServerData: string[],
) => {
  const servers = [...unorderedServers];

  servers.sort((server1, server2) => {
    // get the positions of both servers in the synced list
    const s1index = orderedServerData.indexOf(server1._id);
    const s2index = orderedServerData.indexOf(server2._id);

    // if they're both in the list, subtract server 2's position from server 1's
    if (s1index > -1 && s2index > -1) {
      return (
        orderedServerData.indexOf(server1._id) -
        orderedServerData.indexOf(server2._id)
      );
    }

    // if server 1 isn't in the list and server 2 is, return 1 (server 2 then 1)
    if (s1index === -1 && s2index > -1) {
      return 1;
    }

    // if server 2 isn't in the list and server 1 is, return -1 (server 1 then 2)
    if (s2index === -1 && s1index > -1) {
      return -1;
    }

    // if both aren't in the list, convert the server IDs to timestamps then order them by when they were created
    return server2.createdAt > server1.createdAt ? -1 : 1;
  });

  return servers;
};

const getListEntries = ({
  servers,
  filter,
  orderedServerData,
  includeExtras,
  separateUnread,
}: {
  servers: Server[];
  filter?: any;
  orderedServerData: string[];
  includeExtras: boolean;
  separateUnread: boolean;
}) => {
  let entries: Server[] = [...servers];
  let finalArray: EntriesArray = [...entries];

  if (filter) {
    entries = entries.filter(filter);
  }

  if (separateUnread) {
    let unreadServers: Server[] = [];
    let readServers: Server[] = [];

    for (const server of entries) {
      (server.isUnread() ? unreadServers : readServers).push(server);
    }

    unreadServers = orderServers(unreadServers, orderedServerData);
    readServers = orderServers(readServers, orderedServerData);

    finalArray = [...unreadServers, 'separator', ...readServers];
  } else if (orderedServerData.length > 0) {
    entries = orderServers(entries, orderedServerData);
    finalArray = [...entries];
  }

  if (includeExtras) {
    finalArray.splice(0, 0, 'user');
    if (getInstanceURL() === DEFAULT_API_URL) {
      finalArray.push('discover');
    }
  }

  return finalArray;
};

export const ServerList = observer(
  ({
    onServerPress,
    onServerLongPress,
    filter,
    showUnread = true,
    isMainList = false,
    separateUnread = false,
    horizontal,
    channelSwitcher,
  }: {
    onServerPress: any;
    onServerLongPress?: any;
    filter?: any;
    showUnread?: boolean;
    isMainList?: boolean;
    separateUnread?: boolean;
    horizontal?: boolean;
    channelSwitcher?: boolean;
  }) => {
    const {orderedServers} = useContext(OrderedServersContext);
    const {currentServer, setCurrentServer} = useContext(ServerContext);

    const entries = useMemo(
      () =>
        getListEntries({
          servers: [...client.servers.values()],
          filter,
          orderedServerData: orderedServers,
          includeExtras: isMainList,
          separateUnread,
        }),
      [filter, orderedServers, isMainList, separateUnread],
    );

    const renderItem = ({item}: {item: ListEntry}) => {
      if (typeof item === 'string') {
        switch (item) {
          case 'user':
            return (
              <View>
                <Pressable
                  onPress={() => {
                    currentServer
                      ? setCurrentServer(null)
                      : app.openStatusMenu(true);
                  }}
                  onLongPress={() => {
                    app.openProfile(client.user);
                  }}
                  delayLongPress={750}
                  key={client.user?._id}
                  style={{margin: 4, marginBlockEnd: 8}}>
                  <Avatar
                    key={`${client.user?._id}-avatar`}
                    user={client.user}
                    size={48}
                    backgroundColor={'backgroundSecondary'}
                    status
                  />
                </Pressable>
                <LineSeparator style={localStyles.separator(horizontal)} />
              </View>
            );
          case 'discover':
            return (
              <View>
                <LineSeparator style={localStyles.separator(horizontal)} />
                <TouchableOpacity
                  onPress={() => {
                    app.openChannel('discover');
                  }}
                  key={'serverlist-discover'}
                  style={[
                    localStyles.serverButton(horizontal),
                    {marginBlockStart: 8},
                  ]}>
                  <View style={{alignItems: 'center', marginVertical: '22.5%'}}>
                    <MaterialCommunityIcon name={'compass'} size={25} />
                  </View>
                </TouchableOpacity>
              </View>
            );
          case 'separator':
            return (
              <LineSeparator
                vertical={horizontal}
                style={localStyles.separator(horizontal, channelSwitcher)}
              />
            );
        }
      }

      return (
        <ServerListEntry
          key={item._id}
          server={item}
          onServerPress={onServerPress}
          onServerLongPress={onServerLongPress}
          showUnread={showUnread}
          isHorizontal={horizontal}
        />
      );
    };

    const keyExtractor = (item: ListEntry) => {
      return `member-${typeof item === 'string' ? item : item._id}`;
    };

    return (
      <LegendList
        key={'server-list'}
        keyExtractor={keyExtractor}
        data={entries}
        contentContainerStyle={[
          Platform.OS !== 'web' && isMainList && localStyles.mainList,
          {gap: commonValues.sizes.medium},
        ]}
        renderItem={renderItem}
        horizontal={horizontal}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={48}
      />
    );
  },
);

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  mainList: {
    paddingTop: rt.insets.top,
    paddingInline: commonValues.sizes.small,
  },
  serverButton: (horizontal?: boolean) => ({
    borderRadius: 5000,
    width: 48,
    height: 48,
    backgroundColor: currentTheme.backgroundPrimary,
    overflow: 'hidden',
    ...(horizontal
      ? {marginBlock: commonValues.sizes.small}
      : {marginInline: commonValues.sizes.small}),
  }),
  serverButtonVertical: {
    marginInline: commonValues.sizes.small,
  },
  serverButtonHorizontal: {
    marginBlock: commonValues.sizes.small,
  },
  selectedServer: {
    borderRadius: 12,
  },
  selectedServerIndicator: {
    backgroundColor: currentTheme.foregroundPrimary,
    width: 4,
    height: 40,
    borderRadius: commonValues.sizes.large,
    position: 'absolute',
    top: 4,
    left: -5,
  },
  serverIcon: {
    width: 48,
    height: 48,
  },
  serverButtonInitials: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '30%',
  },
  mentionsIndicator: (horizontal?: boolean) => ({
    borderRadius: 10000,
    backgroundColor: currentTheme.error,
    height: 20,
    width: 20,
    marginBottom: -20,
    ...(!horizontal && {top: -4}),
    left: horizontal ? 32 : 36,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  mentionsIndicatorText: {
    color: '#FFFFFF',
    marginRight: 1,
    marginBottom: 2,
  },
  unreadsIndicator: (horizontal?: boolean) => ({
    borderRadius: 10000,
    borderWidth: 3,
    borderColor: currentTheme.background,
    backgroundColor: currentTheme.foregroundPrimary,
    height: 20,
    width: 20,
    marginBottom: -20,
    ...(!horizontal && {top: -4}),
    left: 36,
    position: 'absolute',
  }),
  separator: (horizontal?: boolean, channelSwitcher?: boolean) => ({
    ...(horizontal
      ? {marginBlock: 6, marginInline: 2, minHeight: 44}
      : {marginInline: 6, marginBlock: 2, minWidth: 44}),
    backgroundColor: channelSwitcher
      ? currentTheme.backgroundPrimary
      : currentTheme.backgroundPrimary,
  }),
}));
