import {useContext, useEffect, useState} from 'react';
import {FlatList, Platform, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {app} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {Button, GeneralAvatar, Text} from '@clerotri/components/common/atoms';
import {ChannelHeader} from '@clerotri/components/navigation/ChannelHeader';
import {SpecialChannelIcon} from '@clerotri/components/navigation/SpecialChannelIcon';
import {client} from '@clerotri/lib/client';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {DOMParserFunction} from '@clerotri/lib/utils';

const parser = DOMParserFunction();

const BotEntry = ({bot}: {bot: any}) => {
  const {currentTheme} = useContext(ThemeContext);

  return (
    <View
      key={`discover-entry-bot-${bot._id}`}
      style={{
        marginBottom: commonValues.sizes.medium,
        borderRadius: commonValues.sizes.medium,
        padding: commonValues.sizes.xl,
        backgroundColor: currentTheme.backgroundSecondary,
      }}>
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
          <Text colour={currentTheme.foregroundSecondary}>{bot._id}</Text>
        </View>
      </View>
      <View
        style={{
          marginBlock: commonValues.sizes.medium,
          backgroundColor: currentTheme.background,
          borderRadius: commonValues.sizes.medium,
          padding: commonValues.sizes.medium,
        }}>
        <Text numberOfLines={5}>{bot.profile.content}</Text>
      </View>
      {bot.tags.length > 0 && (
        <View
          key={`discover-entry-${bot._id}-tags`}
          style={{
            rowGap: commonValues.sizes.small,
            flexWrap: 'wrap',
            flexDirection: 'row',
            marginBlockEnd: commonValues.sizes.medium,
          }}>
          {bot.tags.map((tag: string) => {
            return (
              <View
                style={{
                  padding: commonValues.sizes.small,
                  borderRadius: commonValues.sizes.medium,
                  backgroundColor: currentTheme.buttonBackground,
                  marginEnd: commonValues.sizes.small,
                }}
                key={`discover-entry-${bot._id}-tag-${tag}`}>
                <Text>#{tag}</Text>
              </View>
            );
          })}
        </View>
      )}
      <Button
        style={{margin: 0}}
        onPress={async () => {
          !client.servers.get(bot._id) && (await client.joinInvite(bot._id));
          app.openServer(client.servers.get(bot._id));
          app.openLeftMenu(true);
        }}>
        <Text>Invite Bot</Text>
      </Button>
    </View>
  );
};

const ServerEntry = ({server}: {server: any}) => {
  const {currentTheme} = useContext(ThemeContext);

  return (
    <View
      key={`discover-entry-server-${server._id}`}
      style={{
        marginBottom: commonValues.sizes.medium,
        borderRadius: commonValues.sizes.medium,
        padding: commonValues.sizes.xl,
        backgroundColor: currentTheme.backgroundSecondary,
      }}>
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
          <Text colour={currentTheme.foregroundSecondary}>{server._id}</Text>
        </View>
      </View>
      <View
        style={{
          marginBlock: commonValues.sizes.medium,
          backgroundColor: currentTheme.background,
          borderRadius: commonValues.sizes.medium,
          padding: commonValues.sizes.medium,
        }}>
        <Text numberOfLines={5}>{server.description}</Text>
      </View>
      {server.tags.length > 0 && (
        <View
          key={`discover-entry-${server._id}-tags`}
          style={{
            rowGap: commonValues.sizes.small,
            flexWrap: 'wrap',
            flexDirection: 'row',
            marginBlockEnd: commonValues.sizes.medium,
          }}>
          {server.tags.map((tag: string) => {
            return (
              <View
                style={{
                  padding: commonValues.sizes.small,
                  borderRadius: commonValues.sizes.medium,
                  backgroundColor: currentTheme.buttonBackground,
                  marginEnd: commonValues.sizes.small,
                }}
                key={`discover-entry-${server._id}-tag-${tag}`}>
                <Text>#{tag}</Text>
              </View>
            );
          })}
        </View>
      )}
      <Button
        style={{margin: 0}}
        onPress={async () => {
          !client.servers.get(server._id) &&
            (await client.joinInvite(server._id));
          app.openServer(client.servers.get(server._id));
          app.openLeftMenu(true);
        }}>
        <Text>
          {client.servers.get(server._id) ? 'Go to Server' : 'Join Server'}
        </Text>
      </Button>
    </View>
  );
};

export const DiscoverPage = () => {
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
      const rawData = await fetch(`https://rvlt.gg/discover/${tab}`);
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
      <View style={{flexDirection: 'row', margin: 8}}>
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
          {tab === 'servers' ? (
            <>
              <View style={{paddingHorizontal: commonValues.sizes.medium}}>
                <Text type={'h2'}>
                  {t('app.discover.count_servers', {
                    count: data.servers.length,
                  })}
                </Text>
              </View>
              <FlatList
                key={'discover-scrollview'}
                keyExtractor={keyExtractor}
                data={data.servers}
                style={{flex: 1, padding: commonValues.sizes.medium}}
                contentContainerStyle={{
                  paddingBottom:
                    Platform.OS === 'web' ? 0 : commonValues.sizes.medium,
                }}
                renderItem={renderItem}
              />
            </>
          ) : (
            <>
              <View style={{paddingHorizontal: commonValues.sizes.medium}}>
                <Text type={'h2'}>
                  {t('app.discover.count_bots', {
                    count: data.bots.length,
                  })}
                </Text>
              </View>
              <FlatList
                key={'discover-scrollview'}
                keyExtractor={keyExtractor}
                data={data.bots}
                style={{flex: 1, padding: commonValues.sizes.medium}}
                contentContainerStyle={{
                  paddingBottom:
                    Platform.OS === 'web' ? 0 : commonValues.sizes.medium,
                }}
                renderItem={renderItem}
              />
            </>
          )}
        </>
      ) : (
        <View style={styles.loadingScreen}>
          <Text type={'h1'}>{t(`app.discover.fetching_${tab}`)}</Text>
        </View>
      )}
    </View>
  );
};
