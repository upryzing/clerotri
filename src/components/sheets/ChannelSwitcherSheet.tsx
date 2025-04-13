import {useContext, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type BottomSheetCore from '@gorhom/bottom-sheet';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {Channel, Server} from 'revolt.js';

import {app, setFunction} from '@clerotri/Generic';
import {Input, Text} from '@clerotri/components/common/atoms';
import {BottomSheet} from '@clerotri/components/common/BottomSheet';
import {ChannelIcon} from '@clerotri/components/navigation/ChannelIcon';
import {ServerList} from '@clerotri/components/navigation/ServerList';
import {client} from '@clerotri/lib/client';
import {ChannelContext} from '@clerotri/lib/state';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
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
    const {currentTheme} = useContext(ThemeContext);
    const {setCurrentChannel} = useContext(ChannelContext);

    const [isBeingPressed, setIsBeingPressed] = useState(false);

    const channelCategory = getChannelCategory(channel);

    console.log(channelCategory?.title);

    return (
      <>
        <Pressable
          onPressIn={() => setIsBeingPressed(true)}
          onPressOut={() => setIsBeingPressed(false)}
          onPress={() => {
            setCurrentChannel(channel);
            app.openLeftMenu(false);
            app.openServer(channel.server);
            app.openChannelSwitcher(null);
          }}
          style={{
            flexDirection: 'row',
            backgroundColor: isBeingPressed
              ? currentTheme.hover
              : currentTheme.backgroundPrimary,
            padding: commonValues.sizes.medium,
            borderRadius: commonValues.sizes.medium,
            marginBlockEnd: commonValues.sizes.medium,
            justifyContent: 'space-between',
          }}>
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
                colour={
                  channel.unread
                    ? currentTheme.foregroundPrimary
                    : currentTheme.foregroundSecondary
                }
                style={{
                  fontWeight: 'bold',
                }}>
                {channel.name ??
                  channel.recipient?.display_name ??
                  channel.recipient?.username ??
                  ''}{' '}
              </Text>
              <Text colour={currentTheme.foregroundSecondary}>
                {channelCategory?.title ||
                  (channel.recipient
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
              <View
                style={{
                  width: commonValues.sizes.xl,
                  height: commonValues.sizes.xl,
                  borderRadius: 10000,
                  outlineWidth: commonValues.sizes.small,
                  outlineOffset: -commonValues.sizes.small,
                  outlineColor: currentTheme.error,
                }}
              />
            ) : (
              channel.unread && (
                <View
                  style={{
                    width: commonValues.sizes.xl,
                    height: commonValues.sizes.xl,
                    borderRadius: 10000,
                    backgroundColor: currentTheme.foregroundPrimary,
                  }}
                />
              )
            )}
          </View>
        </Pressable>
      </>
    );
  },
);

const checkIfChannelMatchesQuery = (channel: Channel, query: string) => {
  if (channel.name?.match(query)) {
    return true;
  }

  if (channel.recipient) {
    if (
      channel.recipient.display_name?.match(query) ||
      channel.recipient.username.match(query)
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
  const insets = useSafeAreaInsets();

  const {currentTheme} = useContext(ThemeContext);

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

  setFunction('openChannelSwitcher', (ctx: Server | 'home' | null) => {
    setSelectedServer(ctx === 'home' ? null : ctx);
    setSearchText('');
    ctx ? sheetRef.current?.expand() : sheetRef.current?.close();
    setIsOpen(!!ctx);
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
          paddingBottom: insets.bottom,
        }}>
        <Input
          value={searchText}
          onChangeText={v => setSearchText(v)}
          placeholder={'Search for channels and conversations...'}
          skipRegularStyles={false}
          style={{
            backgroundColor: currentTheme.background,
            marginBlockEnd: commonValues.sizes.large,
          }}
        />
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
