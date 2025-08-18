import {useContext, useEffect, useState} from 'react';
import {Pressable, ScrollView, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import MaterialIcon from '@react-native-vector-icons/material-icons';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';

import type {API, Server, User} from 'revolt.js';

import {app, settings} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {styles} from '@clerotri/Theme';
import {
  Avatar,
  Button,
  ContextButton,
  CopyIDButton,
  GeneralAvatar,
  Text,
  Username,
} from '@clerotri/components/common/atoms';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';
import {
  BadgeView,
  MiniProfile,
  RoleView,
} from '@clerotri/components/common/profile';
import {UserList} from '@clerotri/components/navigation/UserList';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {useBackHandler} from '@clerotri/lib/ui';
import {parseRevoltNodes} from '@clerotri/lib/utils';

const RelationshipButtons = ({user}: {user: User}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  return (
    <View
      style={{flexDirection: 'row', marginBlockEnd: commonValues.sizes.medium}}>
      <View
        style={{
          margin: 0,
          flex: 1,
        }}>
        {!user.bot ? (
          user.relationship === 'Friend' ? (
            <Button
              backgroundColor={currentTheme.backgroundPrimary}
              style={{margin: 0}}
              onPress={async () => {
                const c = await user.openDM();
                try {
                  console.log(`[PROFILE] Switching to DM: ${c}, ${c._id}`);
                  app.openDirectMessage(c);
                } catch (e) {
                  console.log(
                    `[PROFILE] Error switching to DM: ${c._id}, ${e}`,
                  );
                }
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <View>
                  <MaterialIcon
                    name="message"
                    size={25}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
                <Text>Message</Text>
              </View>
            </Button>
          ) : user.relationship === 'Incoming' ? (
            <>
              <Button
                backgroundColor={currentTheme.backgroundPrimary}
                style={{margin: 0, marginBlockEnd: commonValues.sizes.small}}
                onPress={() => {
                  user.addFriend();
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                  <View>
                    <MaterialCommunityIcon
                      name="account-plus"
                      size={25}
                      color={currentTheme.foregroundPrimary}
                    />
                  </View>
                  <Text>{t('app.profile.friend_requests.accept')}</Text>
                </View>
              </Button>
              <Button
                backgroundColor={currentTheme.backgroundPrimary}
                style={{margin: 0}}
                onPress={() => {
                  user.removeFriend();
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                  <View>
                    <MaterialCommunityIcon
                      name="account-remove"
                      size={25}
                      color={currentTheme.foregroundPrimary}
                    />
                  </View>
                  <Text>{t('app.profile.friend_requests.reject')}</Text>
                </View>
              </Button>
            </>
          ) : user.relationship === 'Outgoing' ? (
            <Button
              backgroundColor={currentTheme.backgroundPrimary}
              style={{margin: 0}}
              onPress={() => {
                user.removeFriend();
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <View>
                  <MaterialCommunityIcon
                    name="account-cancel"
                    size={25}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
                <Text>{t('app.profile.friend_requests.cancel')}</Text>
              </View>
            </Button>
          ) : user.relationship !== 'Blocked' &&
            user.relationship !== 'BlockedOther' ? (
            <Button
              backgroundColor={currentTheme.backgroundPrimary}
              style={{margin: 0}}
              onPress={() => {
                user.addFriend();
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <View>
                  <MaterialCommunityIcon
                    name="account-plus"
                    size={25}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
                <Text>{t('app.profile.friend_requests.send')}</Text>
              </View>
            </Button>
          ) : null
        ) : null}
      </View>
    </View>
  );
};

const ProfileTabs = ({setSection}: {setSection: (t: string) => void}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          gap: commonValues.sizes.small,
          marginBlockEnd: commonValues.sizes.small,
        }}>
        <Button
          backgroundColor={currentTheme.backgroundPrimary}
          style={{
            padding: commonValues.sizes.medium,
            margin: 0,
            flex: 1,
          }}
          onPress={() => setSection('Profile')}>
          <Text>{t('app.profile.tabs.profile')}</Text>
        </Button>
        <Button
          backgroundColor={currentTheme.backgroundPrimary}
          style={{
            padding: commonValues.sizes.medium,
            margin: 0,
            flex: 1,
          }}
          onPress={() => setSection('Mutual Friends')}>
          <Text>{t('app.profile.tabs.mutual_friends')}</Text>
        </Button>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: commonValues.sizes.small,
          marginBlockEnd: commonValues.sizes.small,
        }}>
        {/* TODO: uncomment when this has been added 
        <Button
          backgroundColor={currentTheme.backgroundPrimary}
          style={{
            padding: commonValues.sizes.medium,
            margin: 0,
            flex: 1,
          }}
          onPress={() => setSection('Mutual Groups')}>
          <Text>{t('app.profile.tabs.mutual_groups')}</Text>
        </Button> */}
        <Button
          backgroundColor={currentTheme.backgroundPrimary}
          style={{
            padding: commonValues.sizes.medium,
            margin: 0,
            flex: 1,
          }}
          onPress={() => setSection('Mutual Servers')}>
          <Text>{t('app.profile.tabs.mutual_servers')}</Text>
        </Button>
      </View>
    </>
  );
};

export const ProfileSheet = observer(
  ({user, server}: {user: User | null; server: Server | null}) => {
    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    const [section, setSection] = useState('Profile');
    const [profile, setProfile] = useState<API.UserProfile>({});
    const [mutual, setMutual] = useState(
      {} as {users: User[]; servers: Server[]},
    );
    const [showMenu, setShowMenu] = useState(false);

    useBackHandler(() => {
      if (showMenu) {
        setShowMenu(false);
        return true;
      }

      if (section !== 'Profile') {
        setSection('Profile');
        return true;
      }

      return false;
    });

    useEffect(() => {
      async function getInfo() {
        if (!user) {
          return;
        }
        const p = await user.fetchProfile();
        const rawMutuals =
          user.relationship !== 'User'
            ? await user.fetchMutual()
            : {users: [] as string[], servers: [] as string[]};

        const fetchedMutualUsers: User[] = [];
        for (const u of rawMutuals.users) {
          fetchedMutualUsers.push(await client.users.fetch(u));
        }

        const fetchedMutualServers: Server[] = [];
        for (const s of rawMutuals.servers) {
          fetchedMutualServers.push(await client.servers.fetch(s));
        }

        const m = {servers: fetchedMutualServers, users: fetchedMutualUsers};

        setProfile(p);
        setMutual(m);
      }
      getInfo();
    }, [user]);

    return (
      <View
        style={{
          paddingInline: commonValues.sizes.xl,
          paddingBlockEnd: commonValues.sizes.xl,
        }}>
        {!user ? (
          <></>
        ) : showMenu ? (
          <>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: commonValues.sizes.large,
              }}
              onPress={() => {
                setShowMenu(false);
              }}>
              <MaterialIcon
                name="arrow-back"
                size={20}
                color={currentTheme.foregroundSecondary}
              />
              <Text
                style={{
                  color: currentTheme.foregroundSecondary,
                  fontSize: 16,
                  marginLeft: 5,
                }}>
                {t('app.profile.menu.back')}
              </Text>
            </Pressable>
            {settings.get('ui.showDeveloperFeatures') ? (
              <CopyIDButton id={user._id} />
            ) : null}
            {user.relationship !== 'User' ? (
              <>
                <ContextButton
                  onPress={() => {
                    app.openReportMenu({object: user, type: 'User'});
                    setShowMenu(false);
                    app.openProfile(null);
                  }}>
                  <View style={styles.iconContainer}>
                    <MaterialIcon
                      name="flag"
                      size={20}
                      color={currentTheme.error}
                    />
                  </View>
                  <Text colour={currentTheme.error}>
                    {t('app.profile.menu.report_user')}
                  </Text>
                </ContextButton>
                {/* TODO: add block confirm modal then uncomment this {user.relationship !== 'Blocked' ? (
                  <ContextButton
                    onPress={() => {
                      app.openReportMenu({object: user, type: 'User'});
                      setShowMenu(false);
                      app.openProfile(null);
                    }}>
                    <View style={styles.iconContainer}>
                      <MaterialIcon
                        name="block"
                        size={20}
                        color={currentTheme.error}
                      />
                    </View>
                    <Text colour={currentTheme.error}>
                      {t('app.profile.menu.block_user')}
                    </Text>
                  </ContextButton>
                ) : null} */}
              </>
            ) : null}
          </>
        ) : (
          <>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Avatar
                size={80}
                user={user}
                server={server ?? undefined}
                backgroundColor={currentTheme.backgroundSecondary}
                status
                pressable
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={() => setShowMenu(true)}>
                  <MaterialIcon
                    name="more-vert"
                    size={30}
                    color={currentTheme.foregroundPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBlock: commonValues.sizes.medium,
              }}>
              <View>
                <Username user={user} server={server ?? undefined} size={24} />
                {!server ? (
                  <Username
                    user={user}
                    server={server ?? undefined}
                    size={16}
                    color={currentTheme.foregroundSecondary}
                    skipDisplayName
                  />
                ) : null}
                {server ? (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    {client.members.getKey({
                      server: server?._id,
                      user: user._id,
                    })?.avatar?._id !== user.avatar?._id &&
                    client.members.getKey({
                      server: server?._id,
                      user: user._id,
                    })?.avatar?._id !== undefined ? (
                      <View style={{alignSelf: 'center', marginEnd: 4}}>
                        <Avatar size={24} user={user} />
                      </View>
                    ) : null}
                    <View style={{flexDirection: 'column'}}>
                      <Username user={user} size={16} noBadge />
                      <Username
                        user={user}
                        size={16}
                        color={currentTheme.foregroundSecondary}
                        noBadge
                        skipDisplayName
                      />
                    </View>
                  </View>
                ) : null}
                {user.status?.text ? <Text>{user.status?.text}</Text> : null}
              </View>
            </View>
            {user.flags ? (
              /* eslint-disable no-bitwise */
              <Text
                style={{marginBlockEnd: commonValues.sizes.large}}
                colour={currentTheme.error}>
                {t(
                  `app.profile.flags.${
                    user.flags & 1
                      ? 'suspended'
                      : user.flags & 2
                        ? 'deleted'
                        : user.flags & 4
                          ? 'banned'
                          : 'unknown'
                  }`,
                  {flag: user.flags},
                )}
              </Text>
            ) : /* eslint-enable no-bitwise */
            null}
            {user.relationship !== 'User' ? (
              <>
                <RelationshipButtons user={user} />
                <ProfileTabs setSection={setSection} />
              </>
            ) : null}
            {section === 'Profile' ? (
              <ScrollView>
                {user.bot ? (
                  <>
                    <Text type={'profile'}>{t('app.profile.bot_owner')}</Text>
                    {user.bot.owner && client.users.get(user.bot.owner) ? (
                      <Button
                        style={{
                          marginHorizontal: 0,
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          backgroundColor: currentTheme.backgroundPrimary,
                        }}
                        onPress={() => {
                          app.openProfile(client.users.get(user.bot!.owner));
                        }}>
                        <View style={{maxWidth: '90%'}}>
                          <MiniProfile
                            user={client.users.get(user.bot.owner)}
                          />
                        </View>
                      </Button>
                    ) : (
                      <Text style={{color: currentTheme.foregroundSecondary}}>
                        Unloaded user
                      </Text>
                    )}
                  </>
                ) : null}
                {server && <RoleView user={user} server={server} />}
                {user.badges && <BadgeView user={user} />}
                <Text type={'profile'}>{t('app.profile.bio')}</Text>
                {profile.content ? (
                  <MarkdownView>
                    {parseRevoltNodes(profile.content)}
                  </MarkdownView>
                ) : null}
              </ScrollView>
            ) : section === 'Mutual Servers' ? (
              <ScrollView>
                <Text type={'profile'}>
                  {t('app.profile.tabs.mutual_servers')}
                </Text>
                {mutual.servers?.map(srv => {
                  return (
                    <ContextButton
                      key={srv!._id}
                      onPress={() => {
                        app.openServer(srv);
                        app.openProfile(null);
                        app.openLeftMenu(true);
                      }}>
                      <GeneralAvatar attachment={srv!.icon} size={32} />
                      <Text style={{fontWeight: 'bold', marginLeft: 6}}>
                        {srv!.name}
                      </Text>
                    </ContextButton>
                  );
                })}
              </ScrollView>
            ) : section === 'Mutual Friends' ? (
              <ScrollView>
                <Text type={'profile'}>
                  {t('app.profile.tabs.mutual_friends')}
                </Text>
                <UserList users={mutual.users} />
              </ScrollView>
            ) : null}
          </>
        )}
      </View>
    );
  },
);
