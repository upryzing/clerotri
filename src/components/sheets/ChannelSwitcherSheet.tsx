import {useContext, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type BottomSheetCore from '@gorhom/bottom-sheet';
import {ScrollView} from 'react-native-gesture-handler';

import type {Channel, Server} from 'revolt.js';

import {app, setFunction} from '@clerotri/Generic';
import {Input, Text} from '@clerotri/components/common/atoms';
import {BottomSheet} from '@clerotri/components/common/BottomSheet';
import {MaterialCommunityIcon} from '@clerotri/components/common/icons';
import {ChannelIcon} from '@clerotri/components/navigation/ChannelIcon';
import {ServerList} from '@clerotri/components/navigation/ServerList';
import {client} from '@clerotri/lib/client';
import {ChannelContext, ServerContext} from '@clerotri/lib/state';
import {commonValues} from '@clerotri/lib/themes';
import {useBackHandler} from '@clerotri/lib/ui';

const getChannelCategory = (channel: Channel) => {
  if (!channel.server || !channel.server.categories) {
    return null;
  }

  for (const category of channel.server.categories) {
    if (category.channels.includes(channel._id)) {
      return category;
    }
  }

  return null;
};

const SwitcherChannelButton = observer(
  ({channel, showServerName}: {channel: Channel; showServerName?: boolean}) => {
    const {setCurrentChannel} = useContext(ChannelContext);

    const [isBeingPressed, setIsBeingPressed] = useState(false);

    const channelCategory = getChannelCategory(channel);

    return (
      <>
        <Pressable
          onPressIn={() => setIsBeingPressed(true)}
          onPressOut={() => setIsBeingPressed(false)}
          onPress={() => {
            setCurrentChannel(channel);
            app.openLeftMenu(false);
            app.openServer(channel.server);
            app.openChannelSwitcher(false);
          }}
          style={[
            localStyles.channelButton,
            isBeingPressed && localStyles.pressedChannelButton,
          ]}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <ChannelIcon channel={channel} />
            <View
              style={{
                marginInlineStart: commonValues.sizes.medium,
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <Text
                useNewText
                colour={
                  channel.unread ? 'foregroundPrimary' : 'foregroundSecondary'
                }
                style={{
                  fontWeight: 'bold',
                }}>
                {channel.name ??
                  channel.recipient?.display_name ??
                  channel.recipient?.username ??
                  ''}{' '}
              </Text>
              <Text useNewText colour={'foregroundSecondary'}>
                {channelCategory?.title ||
                  (channel.channel_type === 'Group'
                    ? `${channel.recipients?.length} ${channel.recipients?.length === 1 ? 'member' : 'members'}`
                    : channel.recipient
                      ? `@${channel.recipient?.username}#${channel.recipient?.discriminator}`
                      : 'Uncategorised')}
                {showServerName &&
                  channel.server &&
                  ` (${channel.server.name})`}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {channel.mentions.length > 0 ? (
              <View style={localStyles.mentionIndicator} />
            ) : (
              channel.unread && <View style={localStyles.unreadIndicator} />
            )}
          </View>
        </Pressable>
      </>
    );
  },
);

const checkIfChannelMatchesQuery = (channel: Channel, query: string) => {
  if (channel.name?.toLowerCase().match(query)) {
    return true;
  }

  if (channel.recipient) {
    if (
      channel.recipient.display_name?.toLowerCase().match(query) ||
      channel.recipient.username.toLowerCase().match(query)
    ) {
      return true;
    }
  }

  return false;
};

const ChannelSearchResults = observer(({query}: {query: string}) => {
  const channels = [...client.channels.values()];

  const results = channels.filter(c => checkIfChannelMatchesQuery(c, query));

  return results.length > 0 ? (
    <>
      {results.map(result => {
        return (
          <SwitcherChannelButton
            key={`result-${result._id}`}
            channel={result}
            showServerName
          />
        );
      })}
    </>
  ) : (
    <Text>{`No results for "${query}"`}</Text>
  );
});

export const ChannelSwitcherSheet = observer(() => {
  const {currentServer} = useContext(ServerContext);

  const [searchText, setSearchText] = useState('');
  const [selectedServer, setSelectedServer] = useState(null as Server | null);

  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<BottomSheetCore>(null);

  useBackHandler(() => {
    if (searchText) {
      setSearchText('');
      return true;
    }

    if (selectedServer) {
      setSelectedServer(null);
      return true;
    }

    if (isOpen) {
      sheetRef.current?.close();
      setIsOpen(false);
      return true;
    }

    return false;
  });

  setFunction('openChannelSwitcher', (state: boolean) => {
    setSelectedServer(currentServer);
    setSearchText('');
    state ? sheetRef.current?.expand() : sheetRef.current?.close();
    setIsOpen(!!state);
  });

  const handleServerPress = (s: Server) => {
    s._id === selectedServer?._id
      ? setSelectedServer(null)
      : setSelectedServer(s);
  };

  return (
    <BottomSheet sheetRef={sheetRef}>
      <View
        style={{
          paddingHorizontal: commonValues.sizes.xl,
        }}>
        <View style={localStyles.searchBoxContainer}>
          <Input
            value={searchText}
            onChangeText={v => setSearchText(v)}
            placeholder={'Search for channels and conversations...'}
            skipRegularStyles
            style={{
              backgroundColor: '#00000000',
              padding: commonValues.sizes.large,
              flex: 1,
            }}
          />
          {searchText && (
            <Pressable
              onPress={() => setSearchText('')}
              style={{
                paddingInline: commonValues.sizes.large,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialCommunityIcon
                name={'close-circle'}
                size={18}
                color={'foregroundSecondary'}
              />
            </Pressable>
          )}
        </View>
        <View>
          <Text type={'h1'}>
            {searchText
              ? 'Search results'
              : selectedServer
                ? `Channels in ${selectedServer.name}`
                : 'Find a channel'}
          </Text>
          {!searchText && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ScrollView
                style={{height: 56, marginBlockEnd: commonValues.sizes.medium}}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                <ServerList
                  horizontal
                  onServerPress={(s: Server) => handleServerPress(s)}
                  filter={(s: Server) => s.isUnread()}
                  showDiscover={false}
                />
                <ServerList
                  horizontal
                  onServerPress={(s: Server) => handleServerPress(s)}
                  filter={(s: Server) => !s.isUnread()}
                  showDiscover={false}
                />
              </ScrollView>
            </View>
          )}
          {!searchText &&
            selectedServer?.channels &&
            selectedServer.channels.length > 0 &&
            selectedServer.channels.map(channel => {
              return channel ? (
                <SwitcherChannelButton
                  key={`${channel._id}-test`}
                  channel={channel}
                />
              ) : null;
            })}
          {searchText && <ChannelSearchResults query={searchText} />}
        </View>
      </View>
    </BottomSheet>
  );
});

const localStyles = StyleSheet.create(currentTheme => ({
  searchBoxContainer: {
    flexDirection: 'row',
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.background,
    marginBlockEnd: commonValues.sizes.large,
  },
  channelButton: {
    flexDirection: 'row',
    backgroundColor: currentTheme.backgroundPrimary,
    padding: commonValues.sizes.medium,
    borderRadius: commonValues.sizes.medium,
    marginBlockEnd: commonValues.sizes.medium,
    justifyContent: 'space-between',
  },
  pressedChannelButton: {
    backgroundColor: currentTheme.hover,
  },
  mentionIndicator: {
    width: commonValues.sizes.xl,
    height: commonValues.sizes.xl,
    borderRadius: 10000,
    outlineWidth: commonValues.sizes.small,
    outlineOffset: -commonValues.sizes.small,
    outlineColor: currentTheme.error,
  },
  unreadIndicator: {
    width: commonValues.sizes.xl,
    height: commonValues.sizes.xl,
    borderRadius: 10000,
    backgroundColor: currentTheme.foregroundPrimary,
  },
}));
