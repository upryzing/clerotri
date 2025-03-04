import {useContext, useEffect, useState} from 'react';
import {FlatList, Platform, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import type {Member, Server} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms';
import {SettingsEntry} from '@clerotri/components/common/settings/atoms';
import {client} from '@clerotri/lib/client';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const MemberSettingsSection = observer(({server}: {server: Server}) => {
  const insets = useSafeAreaInsets();

  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const [reload, triggerReload] = useState(0);
  const [members, setMembers] = useState(null as Member[] | null);
  const [activeMember, setActiveMember] = useState('');

  useEffect(() => {
    async function fetchMembers() {
      const m = await server.fetchMembers();
      setMembers(m.members);
    }

    fetchMembers();
  }, [server, reload]);

  const renderItem = ({item}: {item: Member}) => {
    return (
      <SettingsEntry
        style={{flexDirection: 'column'}}
        key={`member-settings-entry-${item._id.user}`}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text
              key={`member-settings-entry-${item._id.user}-id`}
              colour={item.roleColour ?? undefined}
              style={{fontWeight: 'bold'}}>
              {item.nickname ?? item.user?.display_name ?? item.user?.username}
            </Text>
            <Text colour={currentTheme.foregroundSecondary}>
              @{item.user?.username}#{item.user?.discriminator}
            </Text>
            <Text colour={currentTheme.foregroundSecondary}>
              {item._id.user}
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
              activeMember !== item._id.user
                ? setActiveMember(item._id.user)
                : setActiveMember('');
            }}>
            <View style={styles.iconContainer}>
              <MaterialIcon
                name={
                  activeMember !== item._id.user ? 'expand-more' : 'expand-less'
                }
                size={24}
                color={currentTheme.foregroundPrimary}
              />
            </View>
          </Pressable>
        </View>
        {activeMember === item._id.user ? (
          <View
            style={{
              flex: 1,
              paddingVertical: commonValues.sizes.xl,
              flexDirection: 'row',
            }}>
            {item._id.user === client.user?._id ||
            (server.havePermission('ManageNicknames') && item.inferior) ? (
              <Pressable
                style={{
                  width: 30,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  app.openTextEditModal({
                    initialString: item.nickname ?? '',
                    id: 'nickname_other',
                    callback: nick => {
                      item.edit(
                        nick === '' ? {remove: ['Nickname']} : {nickname: nick},
                      );
                    },
                  });
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name={'edit'}
                    size={24}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
              </Pressable>
            ) : null}
            {item.kickable ? (
              <Pressable
                style={{
                  width: 30,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  item.kick();
                  triggerReload(reload + 1);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name={'person-remove'}
                    size={24}
                    color={currentTheme.error}
                  />
                </View>
              </Pressable>
            ) : null}
            {item.bannable ? (
              <Pressable
                style={{
                  width: 30,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  server.banUser(item._id.user, {reason: 'sus'});
                  triggerReload(reload + 1);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcon
                    name={'hammer'}
                    size={24}
                    color={currentTheme.error}
                  />
                </View>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </SettingsEntry>
    );
  };

  const keyExtractor = (item: Member) => {
    return `member-${item._id.user}`;
  };

  return (
    <>
      <Text type={'h1'}>{t('app.servers.settings.members.title')}</Text>
      {members ? (
        <FlatList
          key={'server-settings-members-list'}
          keyExtractor={keyExtractor}
          data={members}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'web' ? 0 : insets.bottom,
          }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text>{t('app.servers.settings.members.loading')}</Text>
      )}
    </>
  );
});
