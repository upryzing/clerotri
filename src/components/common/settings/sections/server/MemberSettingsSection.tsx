import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {Member, Server} from 'revolt.js';

import {currentTheme, styles} from '@rvmob/Theme';
import {Text} from '@rvmob/components/common/atoms';
import {app} from '@rvmob/Generic';

export const MemberSettingsSection = observer(({server}: {server: Server}) => {
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

  return (
    <>
      <Text type={'h1'}>{t('app.servers.settings.members.title')}</Text>
      {members ? (
        members.map(m => (
          <View key={`member-settings-entry-${m._id.user}`}>
            <View
              style={{...styles.settingsEntry, flexDirection: 'column'}}
              key={`member-settings-entry-${m._id.user}-main`}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <Text
                    key={`member-settings-entry-${m._id.user}-id`}
                    colour={m.roleColour}
                    style={{fontWeight: 'bold'}}>
                    {m.nickname ?? m.user?.display_name ?? m.user?.username}
                  </Text>
                  <Text colour={currentTheme.foregroundSecondary}>
                    @{m.user?.username}#{m.user?.discriminator}
                  </Text>
                  <Text colour={currentTheme.foregroundSecondary}>
                    {m._id.user}
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
                    activeMember !== m._id.user
                      ? setActiveMember(m._id.user)
                      : setActiveMember('');
                  }}>
                  <View style={styles.iconContainer}>
                    <MaterialIcon
                      name={
                        activeMember !== m._id.user
                          ? 'expand-more'
                          : 'expand-less'
                      }
                      size={24}
                      color={currentTheme.foregroundPrimary}
                    />
                  </View>
                </Pressable>
              </View>
              {activeMember === m._id.user ? (
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    flexDirection: 'row',
                  }}>
                  {server.havePermission('ManageNicknames') && m.inferior ? (
                    <Pressable
                      style={{
                        width: 30,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        app.openTextEditModal({
                          initialString: m.nickname ?? '',
                          id: 'nickname_other',
                          callback: nick => {
                            m.edit(
                              nick === ''
                                ? {remove: ['Nickname']}
                                : {nickname: nick},
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
                  {m.kickable ? (
                    <Pressable
                      style={{
                        width: 30,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        m.kick();
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
                  {m.bannable ? (
                    <Pressable
                      style={{
                        width: 30,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        server.banUser(m._id.user, {reason: 'sus'});
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
            </View>
          </View>
        ))
      ) : (
        <Text>{t('app.servers.settings.members.loading')}</Text>
      )}
    </>
  );
});
