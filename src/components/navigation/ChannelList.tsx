import {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {API, Channel, Server} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {ChannelButton, Text} from '../common/atoms';
import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';
import {
  ChannelContext,
  ServerContext,
  SideMenuContext,
} from '@clerotri/lib/state';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

type UserChannelListChannel =
  Channel | 'Home' | 'Friends' | 'Saved Notes' | 'Debug';

type ServerChannelListProps = {
  currentServer: Server;
};

const ServerChannelListCategory = observer(
  ({category}: {category: API.Category}) => {
    const {currentChannel, setCurrentChannel} = useContext(ChannelContext);

    const {setSideMenuOpen} = useContext(SideMenuContext);

    const [isVisible, setIsVisible] = useState(true);

    // in some cases, channels in the category channel list either:
    // - may not be visible to the user due to permissions or
    // - may have been deleted and not removed from the list yet.

    // the latter is a Stoat bug (see https://github.com/stoatchat/stoatchat/issues/173), but the former seems intentional to me.
    // we need to fetch the channels anyway to render them, so check if any
    // can actually be fetched - if not, and the category ID is `default`,
    // hide the category entirely
    const fetchableChannels: Channel[] = [];

    for (const channel of category.channels) {
      const fetchedChannel = client.channels.get(channel);
      if (fetchedChannel) {
        fetchableChannels.push(fetchedChannel);
      }
    }

    if (category.id === 'default' && !fetchableChannels.length) return null;

    return (
      <View key={category.id}>
        <TouchableOpacity
          key={`${category.id}-title`}
          onPress={() => {
            setIsVisible(!isVisible);
          }}
          style={{
            paddingInline: commonValues.sizes.xl,
            paddingBlockEnd: commonValues.sizes.xs,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
            }}>
            {category.title?.toUpperCase()}
          </Text>
          <MaterialIcon
            name={isVisible ? 'expand-less' : 'expand-more'}
            size={20}
          />
        </TouchableOpacity>
        <View
          style={{
            marginBlockStart: commonValues.sizes.small,
            gap: commonValues.sizes.xs,
          }}>
          {fetchableChannels.map(c => {
            /* TODO: setting for showing unread channels regardless */
            return isVisible ? (
              <ChannelButton
                key={c._id}
                channel={c}
                onPress={() => {
                  setCurrentChannel(c);
                  setSideMenuOpen(false);
                }}
                onLongPress={() => app.openChannelContextMenu(c)}
                selected={
                  typeof currentChannel !== 'string' &&
                  currentChannel?._id === c._id
                }
              />
            ) : null;
          })}
        </View>
      </View>
    );
  },
);

const ServerChannelList = observer((props: ServerChannelListProps) => {
  const {currentTheme} = useContext(ThemeContext);

  const {currentChannel, setCurrentChannel} = useContext(ChannelContext);
  const {setSideMenuOpen} = useContext(SideMenuContext);

  const [uncategorisedChannets, setUncategorisedChannels] = useState(
    [] as string[],
  );

  useEffect(() => {
    let channels = [...props.currentServer.channel_ids];
    if (props.currentServer.categories) {
      for (const category of props.currentServer.categories) {
        for (const channel of category.channels) {
          channels = channels.filter(c => c !== channel);
        }
      }
    }

    setUncategorisedChannels(channels);
  }, [props.currentServer]);

  return (
    <>
      {props.currentServer.banner ? (
        <ImageBackground
          source={{uri: props.currentServer.generateBannerURL()}}
          style={{
            width: '100%',
            height: 110,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => app.openServerContextMenu(props.currentServer)}
            style={{
              width: '100%',
              paddingHorizontal: 12,
              experimental_backgroundImage: [
                {
                  type: 'linear-gradient',
                  colorStops: [
                    {color: `#00000000`},
                    {color: `${currentTheme.backgroundSecondary}`},
                  ],
                },
              ],
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={subListStyles.serverName} numberOfLines={1}>
                {props.currentServer.name}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcon name={'dots-horizontal'} size={30} />
              </View>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      ) : (
        <TouchableOpacity
          onPress={() => app.openServerContextMenu(props.currentServer)}
          style={{width: '100%', paddingHorizontal: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={subListStyles.serverName} numberOfLines={1}>
              {props.currentServer.name}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcon name={'dots-horizontal'} size={30} />
            </View>
          </View>
        </TouchableOpacity>
      )}
      <View
        style={{
          gap: commonValues.sizes.xs,
          marginBlockStart: commonValues.sizes.medium,
        }}>
        {uncategorisedChannets.map(cid => {
          const c = client.channels.get(cid);
          if (c) {
            return (
              <ChannelButton
                key={c._id}
                channel={c}
                onPress={() => {
                  setCurrentChannel(c);
                  setSideMenuOpen(false);
                }}
                onLongPress={() => app.openChannelContextMenu(c)}
                selected={
                  typeof currentChannel !== 'string' &&
                  currentChannel?._id === c._id
                }
              />
            );
          }
        })}
      </View>
      <View
        style={{
          gap: commonValues.sizes.medium,
          marginBlockStart: commonValues.sizes.medium,
        }}>
        {props.currentServer.categories?.map(cat => {
          return (
            <ServerChannelListCategory
              key={`category-${props.currentServer._id}-${cat.id}`}
              category={cat}
            />
          );
        })}
      </View>
    </>
  );
});

const UserChannelList = observer(() => {
  const {t} = useTranslation();

  const {currentChannel, setCurrentChannel} = useContext(ChannelContext);
  const {setSideMenuOpen} = useContext(SideMenuContext);

  const renderItem = ({item}: {item: UserChannelListChannel}) => {
    return typeof item === 'string' ? (
      item === 'Home' ? (
        <ChannelButton
          onPress={() => {
            setCurrentChannel(null);
            setSideMenuOpen(false);
          }}
          key={'home'}
          channel={'Home'}
          selected={currentChannel === null}
        />
      ) : item === 'Friends' ? (
        <ChannelButton
          onPress={() => {
            setCurrentChannel('friends');
            setSideMenuOpen(false);
          }}
          key={'friends'}
          channel={'Friends'}
          selected={currentChannel === 'friends'}
        />
      ) : item === 'Saved Notes' ? (
        <ChannelButton
          onPress={async () => {
            const channel = await client.user?.openDM();
            setCurrentChannel(channel ?? null);
            setSideMenuOpen(false);
          }}
          key={'notes'}
          channel={'Saved Notes'}
          selected={
            typeof currentChannel !== 'string' &&
            currentChannel?.channel_type === 'SavedMessages'
          }
        />
      ) : __DEV__ ? (
        <ChannelButton
          onPress={() => {
            setCurrentChannel('debug');
            setSideMenuOpen(false);
          }}
          key={'debugChannel'}
          channel={'Debug'}
          selected={currentChannel === 'debug'}
        />
      ) : null
    ) : (
      <ChannelButton
        onPress={() => {
          setCurrentChannel(item);
          setSideMenuOpen(false);
        }}
        onLongPress={() => {
          app.openProfile(item.recipient);
        }}
        delayLongPress={750}
        channel={item}
        selected={
          typeof currentChannel !== 'string' && currentChannel?._id === item._id
        }
      />
    );
  };

  const keyExtractor = (item: UserChannelListChannel) => {
    return `connversation-${typeof item === 'string' ? item : item._id}`;
  };

  const conversations = [...client.channels.values()]
    .filter(
      c => c.channel_type === 'DirectMessage' || c.channel_type === 'Group',
    )
    .sort((c1, c2) => c2.updatedAt - c1.updatedAt);

  const channels = [
    'Home',
    'Friends',
    'Saved Notes',
    'Debug',
    ...conversations,
  ] as const;

  return (
    <>
      <Text style={subListStyles.userChannelListHeader}>
        {t('app.channel_list.direct_messages_header')}
      </Text>
      <FlatList
        key={'user-channel-list-conversations'}
        keyExtractor={keyExtractor}
        data={channels}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'web' ? 0 : commonValues.sizes.medium,
        }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
});

export const ChannelList = observer(() => {
  const {currentServer} = useContext(ServerContext);

  return currentServer ? (
    <ScrollView
      key={'channel-list'}
      style={localStyles.channelList}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <ServerChannelList currentServer={currentServer} />
    </ScrollView>
  ) : (
    <View key={'channel-list'} style={localStyles.channelList}>
      <UserChannelList />
    </View>
  );
});

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  channelList: {
    backgroundColor: currentTheme.backgroundSecondary,
    flexGrow: 1000,
    flex: 1000,
    ...(Platform.OS !== 'web' && {marginTop: rt.insets.top}),
  },
}));

const subListStyles = StyleSheet.create({
  userChannelListHeader: {
    marginLeft: commonValues.sizes.large,
    margin: commonValues.sizes.xl,
    fontSize: 18,
    fontWeight: 'bold',
  },
  serverName: {
    marginVertical: 10,
    maxWidth: '90%',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
