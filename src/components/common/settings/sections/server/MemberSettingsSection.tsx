import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Platform, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {LegendList} from '@legendapp/list';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {API, Member, Server} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {settings} from '@clerotri/lib/settings';
import {styles} from '@clerotri/Theme';
import {
  BackButton,
  InputWithButtonV2,
  Text,
} from '@clerotri/components/common/atoms';
import {PressableSettingsEntry} from '@clerotri/components/common/settings/atoms';
import {GapView} from '@clerotri/components/layout';
import {client} from '@clerotri/lib/client';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import type {SettingsSection} from '@clerotri/lib/types';

const MemberListEntry = observer(
  ({
    item,
    handleTap,
    handleSelect,
    selectMode,
    selected,
  }: {
    item: Member;
    handleTap: () => void;
    handleSelect: () => void;
    selectMode: boolean;
    selected: boolean;
  }) => {
    const {currentTheme} = useContext(ThemeContext);

    return (
      <PressableSettingsEntry
        style={{flexDirection: 'column'}}
        key={`member-settings-entry-${item._id.user}`}
        onPress={() => handleTap()}
        onLongPress={() => handleSelect()}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text
              key={`member-settings-entry-${item._id.user}-id`}
              colour={item.roleColour ?? currentTheme.foregroundPrimary}
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
          <View style={styles.iconContainer}>
            <MaterialIcon
              name={
                selectMode
                  ? selected
                    ? 'radio-button-on'
                    : 'radio-button-off'
                  : 'arrow-forward'
              }
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </View>
        </View>
      </PressableSettingsEntry>
    );
  },
);

const MemberList = observer(
  ({
    server,
    section,
    setSection,
    setMember,
  }: {
    server: Server;
    section: SettingsSection;
    setSection: Dispatch<SetStateAction<SettingsSection>>;
    setMember: Function;
  }) => {
    const insets = useSafeAreaInsets();

    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    const [reload, triggerReload] = useState(0);
    const [members, setMembers] = useState(null as Member[] | null);

    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

    useEffect(() => {
      async function fetchMembers() {
        const m = await server.fetchMembers();
        setMembers(m.members);
      }

      fetchMembers();
    }, [server, reload]);

    useEffect(() => {
      console.log(
        '[MEMBERSETTINGS] Setting up listeners for the member list...',
      );

      function onUserJoin(m: Member) {
        console.log('hi!');
        if (m._id.server === server._id) {
          triggerReload(count => count + 1);
        }
      }

      function onUserLeave(m: API.MemberCompositeKey) {
        console.log('bye!');
        if (m.server === server._id) {
          triggerReload(count => count + 1);
        }
      }

      function setUpListeners() {
        client.addListener('member/join', onUserJoin);
        client.addListener('member/leave', onUserLeave);
      }

      function cleanupListeners() {
        client.removeListener('member/join', onUserJoin);
        client.removeListener('member/leave', onUserLeave);
      }

      try {
        setUpListeners();
      } catch (err) {
        console.log(
          `[MEMBERSETTINGS] Error setting up listeners for the member list: ${err}`,
        );
      }

      // called when the list is remounted
      return () => cleanupListeners();
    }, [server._id]);

    const selectMember = (member: Member) => {
      const isPresent = selectedMembers.find(
        m => m._id.user === member._id.user,
      );

      if (!isPresent) {
        console.log('not present');
        setSelectedMembers([...selectedMembers, member]);
      } else {
        console.log('present');
        setSelectedMembers(
          selectedMembers.filter(m => m._id.user !== member._id.user),
        );
      }
    };

    const renderItem = ({item}: {item: Member}) => {
      return (
        <MemberListEntry
          item={item}
          handleTap={() => {
            if (!section?.subsection) {
              setMember(item);
            } else {
              selectMember(item);
            }
          }}
          handleSelect={() => {
            if (settings.get('ui.settings.showExperimental')) {
              !section?.subsection &&
                setSection({section: 'members', subsection: 'selectMode'});
              selectMember(item);
            }
          }}
          selectMode={section?.subsection === 'selectMode'}
          selected={!!selectedMembers.find(m => m._id.user === item._id.user)}
        />
      );
    };

    const keyExtractor = (item: Member) => {
      return `member-${item._id.user}`;
    };

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: commonValues.sizes.medium,
          }}>
          <Text type={'h1'}>
            {section?.subsection
              ? t('app.servers.settings.members.select_mode.title', {
                  count: selectedMembers.length,
                })
              : t('app.servers.settings.members.title')}
          </Text>
          {settings.get('ui.settings.showExperimental') && (
            <Pressable
              onPress={() => {
                const isCurrentlyActive = section?.subsection === 'selectMode';
                setSection({
                  section: 'members',
                  subsection: isCurrentlyActive ? undefined : 'selectMode',
                });
                isCurrentlyActive && setSelectedMembers([]);
              }}
              style={{
                width: 30,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcon
                  name={
                    section?.subsection === 'selectMode'
                      ? 'close'
                      : 'checkbox-multiple-blank-outline'
                  }
                  size={24}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
            </Pressable>
          )}
        </View>
        {members ? (
          <LegendList
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
  },
);

const MemberSettings = observer(
  ({
    server,
    member,
    onKickOrBan,
  }: {
    server: Server;
    member: Member;
    onKickOrBan: (
      member: Member,
      action: 'kick' | 'ban',
      reason: string,
    ) => void;
  }) => {
    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    const displayName =
      member.nickname ?? member.user?.display_name ?? member.user?.username;

    const canEditNickname =
      client.user?._id === member._id.user ||
      (server.havePermission('ManageNicknames') && member.inferior);

    return (
      <>
        <Text
          type={'h1'}
          colour={member.roleColour ?? currentTheme.foregroundPrimary}>
          {displayName}
        </Text>
        <Text colour={currentTheme.foregroundSecondary}>{member._id.user}</Text>
        <GapView size={8} />
        <Text type={'h2'}>{t('app.servers.settings.members.nickname')}</Text>
        <InputWithButtonV2
          inputProps={{
            placeholder: t('app.servers.settings.members.nickname_placeholder'),
            defaultValue: member.nickname ?? '',
            editable: canEditNickname,
          }}
          buttonProps={{
            children: (
              <MaterialIcon
                name={'save'}
                color={currentTheme.foregroundPrimary}
                size={20}
              />
            ),
            disabled: !canEditNickname,
          }}
          containerStyles={{backgroundColor: currentTheme.backgroundSecondary}}
          buttonStyles={{borderStartColor: currentTheme.backgroundPrimary}}
          callback={v => {
            member.edit(v === '' ? {remove: ['Nickname']} : {nickname: v});
          }}
          skipIfSame
        />
        <GapView size={4} />
        {
          /* TODO: timeout menu */ false && (
            <PressableSettingsEntry>
              <View>
                <Text style={{fontWeight: 'bold'}} colour={currentTheme.error}>
                  {t('app.servers.settings.members.timeout_user', {
                    name: displayName,
                  })}
                </Text>
                <Text colour={currentTheme.foregroundSecondary}>
                  {t('app.servers.settings.members.timeout_user_body')}
                </Text>
              </View>
            </PressableSettingsEntry>
          )
        }
        {member.kickable && (
          <PressableSettingsEntry
            onPress={() =>
              app.openModActionModal({
                member,
                action: 'kick',
                callback: (reason: string) =>
                  onKickOrBan(member, 'kick', reason),
              })
            }>
            <View>
              <Text style={{fontWeight: 'bold'}} colour={currentTheme.error}>
                {t('app.servers.settings.members.kick_user', {
                  name: displayName,
                })}
              </Text>
              <Text colour={currentTheme.foregroundSecondary}>
                {t('app.servers.settings.members.kick_user_body')}
              </Text>
            </View>
          </PressableSettingsEntry>
        )}
        {member.bannable && (
          <PressableSettingsEntry
            onPress={() =>
              app.openModActionModal({
                member,
                action: 'ban',
                callback: (reason: string) =>
                  onKickOrBan(member, 'ban', reason),
              })
            }>
            <View>
              <Text style={{fontWeight: 'bold'}} colour={currentTheme.error}>
                {t('app.servers.settings.members.ban_user', {
                  name: displayName,
                })}
              </Text>
              <Text colour={currentTheme.foregroundSecondary}>
                {t('app.servers.settings.members.ban_user_body')}
              </Text>
            </View>
          </PressableSettingsEntry>
        )}
      </>
    );
  },
);

export const MemberSettingsSection = observer(
  ({
    server,
    section,
    setSection,
  }: {
    server: Server;
    section: SettingsSection;
    setSection: Dispatch<SetStateAction<SettingsSection>>;
  }) => {
    const [currentMember, setCurrentMember] = useState<Member | null>(null);

    const setSectionAndMember = (member: Member) => {
      setCurrentMember(member);
      setSection({section: 'members', subsection: `member-${member._id.user}`});
    };

    const handleBackInSubsection = () => {
      setCurrentMember(null);
      setSection({section: 'members', subsection: undefined});
    };

    const onKickOrBan = (
      member: Member,
      action: 'kick' | 'ban',
      reason: string,
    ) => {
      console.log(member._id.user, action, reason);
      handleBackInSubsection();
      app.openModActionModal(null);
      if (action === 'kick') {
        member.kick();
      } else {
        server.banUser(member._id.user, {reason: reason});
      }
    };

    return (
      <>
        <BackButton
          callback={() => {
            section!.subsection ? handleBackInSubsection() : setSection(null);
          }}
          margin
        />
        {section?.subsection?.startsWith('member') && currentMember ? (
          <MemberSettings
            server={server}
            member={currentMember}
            onKickOrBan={onKickOrBan}
          />
        ) : (
          <MemberList
            server={server}
            section={section}
            setSection={setSection}
            setMember={setSectionAndMember}
          />
        )}
      </>
    );
  },
);
