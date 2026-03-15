import {type Dispatch, type SetStateAction, useContext} from 'react';

import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import type {Member, Server} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {InputWithButtonV2, Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {PressableSettingsEntry} from '@clerotri/components/common/settings/atoms';
import {GapView} from '@clerotri/components/layout';
import {client} from '@clerotri/lib/client';
import {ThemeContext} from '@clerotri/lib/themes';
import type {SettingsSection} from '@clerotri/lib/types';
import {MemberRoles} from './MemberRoles';

export const MemberSettings = observer(
  ({
    server,
    member,
    onKickOrBan,
    section,
    setSection,
  }: {
    server: Server;
    member: Member;
    onKickOrBan: (
      member: Member,
      action: 'kick' | 'ban',
      reason: string,
    ) => void;
    section: SettingsSection;
    setSection: Dispatch<SetStateAction<SettingsSection>>;
  }) => {
    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    const displayName =
      member.nickname ?? member.user?.display_name ?? member.user?.username;

    const canEditNickname =
      client.user?._id === member._id.user ||
      (server.havePermission('ManageNicknames') && member.inferior);

    const canEditRoles =
      client.user?._id === member._id.user ||
      (server.havePermission('AssignRoles') && member.inferior);

    return section?.subsection?.endsWith('-roles') ? (
      <MemberRoles server={server} member={member} />
    ) : (
      <>
        <Text
          useNewText
          type={'h1'}
          customColour={member.roleColour ?? undefined}>
          {displayName}
        </Text>
        <Text useNewText colour={'foregroundSecondary'}>
          {member._id.user}
        </Text>
        <GapView size={8} />
        <Text type={'h2'}>{t('app.servers.settings.members.nickname')}</Text>
        <InputWithButtonV2
          inputProps={{
            placeholder: t('app.servers.settings.members.nickname_placeholder'),
            defaultValue: member.nickname ?? '',
            editable: canEditNickname,
          }}
          buttonProps={{
            children: <MaterialIcon name={'save'} size={20} />,
            disabled: !canEditNickname,
          }}
          containerStyles={{backgroundColor: currentTheme.backgroundSecondary}}
          buttonStyles={{borderStartColor: currentTheme.backgroundPrimary}}
          callback={v => {
            member.edit(v === '' ? {remove: ['Nickname']} : {nickname: v});
          }}
          skipIfSame
        />
        <GapView size={6} />
        {canEditRoles && (
          <PressableSettingsEntry
            onPress={() => {
              setSection({
                section: 'members',
                subsection: `${section?.subsection}-roles`,
              });
            }}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text useNewText style={{fontWeight: 'bold'}}>
                {t('app.servers.settings.members.manage_roles')}
              </Text>
              <Text useNewText colour={'foregroundSecondary'}>
                {t('app.servers.settings.members.manage_roles_body', {
                  name: displayName,
                  count: member.roles?.length || 0,
                })}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <MaterialIcon name={'arrow-forward'} size={20} />
            </View>
          </PressableSettingsEntry>
        )}
        <GapView size={4} />
        {
          /* TODO: timeout menu */ false && (
            <PressableSettingsEntry>
              <View>
                <Text useNewText style={{fontWeight: 'bold'}} colour={'error'}>
                  {t('app.servers.settings.members.timeout_user', {
                    name: displayName,
                  })}
                </Text>
                <Text useNewText colour={'foregroundSecondary'}>
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
              <Text useNewText style={{fontWeight: 'bold'}} colour={'error'}>
                {t('app.servers.settings.members.kick_user', {
                  name: displayName,
                })}
              </Text>
              <Text useNewText colour={'foregroundSecondary'}>
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
              <Text useNewText style={{fontWeight: 'bold'}} colour={'error'}>
                {t('app.servers.settings.members.ban_user', {
                  name: displayName,
                })}
              </Text>
              <Text useNewText colour={'foregroundSecondary'}>
                {t('app.servers.settings.members.ban_user_body')}
              </Text>
            </View>
          </PressableSettingsEntry>
        )}
      </>
    );
  },
);
