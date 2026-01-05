import {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {app} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {Button, GeneralAvatar, Text} from '@clerotri/components/common/atoms';
import {ChannelHeader} from '@clerotri/components/navigation/ChannelHeader';
import {SpecialChannelIcon} from '@clerotri/components/navigation/SpecialChannelIcon';
import {client} from '@clerotri/lib/client';
import {commonValues} from '@clerotri/lib/themes';
import {DOMParserFunction} from '@clerotri/lib/utils';

const parser = DOMParserFunction();

const ItemDescription = ({description}: {description: string}) => {
  return (
    <View style={localStyles.description}>
      <Text numberOfLines={5}>{description}</Text>
    </View>
  );
};

const ItemTags = ({itemID, tags}: {itemID: string; tags: string[]}) => {
  return (
    <View
      key={`discover-entry-${itemID}-tags`}
      style={localStyles.tagsContainer}>
      {tags.map((tag: string) => {
        return (
          <View
            style={localStyles.tag}
            key={`discover-entry-${itemID}-tag-${tag}`}>
            <Text>#{tag}</Text>
          </View>
        );
      })}
    </View>
  );
};

const BotEntry = ({bot}: {bot: any}) => {
  return (
    <View
      key={`discover-entry-bot-${bot._id}`}
      style={localStyles.itemContainer}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {bot.avatar ? (
          <View style={{marginEnd: 8}}>
            <GeneralAvatar
              attachment={bot.avatar._id}
              size={40}
              directory={'/avatars/'}
            />
          </View>
        ) : null}
        <View>
          <Text type={'h1'}>{bot.username}</Text>
          <Text useNewText colour={'foregroundSecondary'}>
            {bot._id}
          </Text>
        </View>
      </View>
      {bot.profile.content && (
        <ItemDescription description={bot.profile.content} />
      )}
      {bot.tags.length > 0 && <ItemTags itemID={bot._id} tags={bot.tags} />}
      <Button
        style={{margin: 0}}
        onPress={() => {
          app.openBotInvite(bot._id);
        }}>
        <Text>Invite Bot</Text>
      </Button>
    </View>
  );
};

const ServerEntry = ({server}: {server: any}) => {
  return (
    <View
      key={`discover-entry-server-${server._id}`}
      style={localStyles.itemContainer}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {server.icon ? (
          <View style={{marginEnd: 8}}>
            <GeneralAvatar
              attachment={server.icon._id}
              size={40}
              directory={'/icons/'}
            />
          </View>
        ) : null}
        <View>
          <Text type={'h1'}>{server.name}</Text>
          <Text useNewText colour={'foregroundSecondary'}>
            {server._id}
          </Text>
        </View>
      </View>
      {server.description && (
        <ItemDescription description={server.description} />
      )}
      {server.tags.length > 0 && (
        <ItemTags itemID={server._id} tags={server.tags} />
      )}
      <Button
        style={{margin: 0}}
        onPress={() => {
          if (client.servers.get(server._id)) {
            app.openServer(client.servers.get(server._id));
            app.openLeftMenu(true);
          } else {
            app.openInvite(server._id);
          }
        }}>
        <Text>
          {client.servers.get(server._id) ? 'Go to Server' : 'Join Server'}
        </Text>
      </Button>
    </View>
  );
};

export const DiscoverPage = () => {
  const insets = useSafeAreaInsets();

  const {t} = useTranslation();

  const [tab, setTab] = useState<'servers' | 'bots'>('servers');
  const [data, setData] = useState<any>(null);

  const renderItem = ({item}: {item: any}) => {
    return tab === 'servers' ? (
      <ServerEntry server={item} />
    ) : (
      <BotEntry bot={item} />
    );
  };

  const keyExtractor = (item: any) => {
    return `discover-entry-${item._id}`;
  };

  useEffect(() => {
    async function fetchData() {
      const rawData = await fetch(`https://stt.gg/discover/${tab}`);
      const unparsedText = await rawData.text();

      // code based on https://codeberg.org/Doru/Discoverolt/src/branch/pages/index.html

      const element = parser
        .parseFromString(unparsedText, 'text/html')
        .getElementById('__NEXT_DATA__');

      if (!element || !element.childNodes[0]) {
        return setData({});
      }

      // @ts-expect-error works fine so meh
      const rawJSON = element.childNodes[0].data;
      const json = JSON.parse(rawJSON).props.pageProps;
      setData(json);
    }

    fetchData();
  }, [tab]);

  return (
    <View style={{flex: 1}}>
      <ChannelHeader
        icon={<SpecialChannelIcon channel={'Discover'} />}
        name={t(`app.discover.header_${tab}`)}
      />
      <View style={{flexDirection: 'row', margin: commonValues.sizes.medium}}>
        <Button
          style={{flex: 1}}
          onPress={() => {
            if (tab !== 'servers') {
              setData(null);
              setTab('servers');
            }
          }}>
          <Text>{t('app.discover.tabs.servers')}</Text>
        </Button>
        <Button
          style={{flex: 1}}
          onPress={() => {
            if (tab !== 'bots') {
              setData(null);
              setTab('bots');
            }
          }}>
          <Text>{t('app.discover.tabs.bots')}</Text>
        </Button>
      </View>
      {data ? (
        <>
          <View
            style={{
              paddingInline: commonValues.sizes.xl,
              paddingBlockEnd: commonValues.sizes.large,
            }}>
            <Text style={{marginBottom: 0}} type={'h2'}>
              {t(`app.discover.count_${tab}`, {
                count: data[tab].length,
              })}
            </Text>
          </View>
          <FlatList
            key={'discover-scrollview'}
            keyExtractor={keyExtractor}
            data={data[tab]}
            style={{flex: 1, marginInline: commonValues.sizes.large}}
            contentContainerStyle={{
              gap: commonValues.sizes.medium,
              paddingBottom: insets.bottom + commonValues.sizes.large,
            }}
            renderItem={renderItem}
          />
        </>
      ) : (
        <View style={styles.loadingScreen}>
          <Text type={'h1'}>{t(`app.discover.fetching_${tab}`)}</Text>
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  itemContainer: {
    borderRadius: commonValues.sizes.medium,
    padding: commonValues.sizes.xl,
    backgroundColor: currentTheme.backgroundSecondary,
  },
  description: {
    marginBlock: commonValues.sizes.medium,
    backgroundColor: currentTheme.background,
    borderRadius: commonValues.sizes.medium,
    padding: commonValues.sizes.medium,
  },
  tagsContainer: {
    rowGap: commonValues.sizes.small,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBlockEnd: commonValues.sizes.medium,
  },
  tag: {
    padding: commonValues.sizes.small,
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.buttonBackground,
    marginEnd: commonValues.sizes.small,
  },
}));
