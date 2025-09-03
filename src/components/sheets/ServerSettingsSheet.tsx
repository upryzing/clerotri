import {useContext, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';

import type {Server} from 'revolt.js';

import {app, setFunction} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {Image} from '@clerotri/crossplat/Image';
import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';
import {SettingsSection} from '@clerotri/lib/types';
import {BackButton, Text} from '@clerotri/components/common/atoms';
import {SettingsButton} from '@clerotri/components/common/buttons';
import {
  BanSettingsSection,
  ChannelSettingsSection,
  InviteSettingsSection,
  RoleSettingsSection,
  MemberSettingsSection,
  OverviewSettingsSection,
  EmojiSettingsSection,
} from '../common/settings/sections/server';
import {GapView} from '../layout';

export const ServerSettingsSheet = observer(
  ({server, setState}: {server: Server; setState: Function}) => {
    const insets = useSafeAreaInsets();

    const {currentTheme} = useContext(ThemeContext);
    const localStyles = generateLocalStyles(currentTheme, insets.top);

    const {t} = useTranslation();

    // const [renderCount, rerender] = useState(0);
    const [section, setSection] = useState<SettingsSection>(null);

    const iconURL = useMemo(() => server.generateIconURL(), [server]);
    const initials = useMemo(() => {
      let i = '';
      for (const word of server.name.split(' ')) {
        i += word.charAt(0);
      }
      return i;
    }, [server.name]);

    setFunction(
      'handleServerSettingsVisibility',
      (setVisibility: (state: null) => void) => {
        if (section) {
          if (section.subsection) {
            setSection(
              section?.subsection.match('-permissions')
                ? {
                    section: section.section,
                    subsection: section.subsection.replace('-permissions', ''),
                  }
                : {section: section.section},
            );
          } else {
            setSection(null);
          }
        } else {
          setVisibility(null);
        }
      },
    );

    return (
      <View style={localStyles.background}>
        {section == null ? (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
            onPress={() => {
              setState();
            }}>
            <MaterialCommunityIcon
              name="close-circle"
              size={24}
              color={currentTheme.foregroundSecondary}
            />
            <Text
              style={{
                color: currentTheme.foregroundSecondary,
                fontSize: 20,
                marginLeft: 5,
              }}>
              {t('app.actions.close')}
            </Text>
          </Pressable>
        ) : /* the channel, role and member settings menus handle this themselves as they have subsections */
        section.section !== 'roles' &&
          section.section !== 'channels' &&
          section.section !== 'members' ? (
          <BackButton callback={() => setSection(null)} margin />
        ) : null}
        {section?.section === 'members' ? (
          <MemberSettingsSection
            server={server}
            section={section}
            setSection={setSection}
          />
        ) : (
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{
              paddingBottom: insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {section == null ? (
              <>
                <View
                  style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  {iconURL ? (
                    <Image
                      key={`server-settings-${server._id}-icon`}
                      source={{uri: iconURL}}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 5000,
                      }}
                    />
                  ) : (
                    <View style={localStyles.serverNameInitials}>
                      <Text
                        key={`server-settings-${server._id}-initials`}
                        style={{fontWeight: 'bold', fontSize: 20}}>
                        {initials}
                      </Text>
                    </View>
                  )}
                  <GapView size={5} />
                  <Text type={'h1'}>{server.name}</Text>
                </View>
                <Text type={'h1'}>{t('app.servers.settings.general')}</Text>
                <SettingsButton
                  menu={'server'}
                  type={'start'}
                  section={'overview'}
                  icon={{pack: 'regular', name: 'info'}}
                  onPress={() => {
                    setSection({section: 'overview'});
                  }}
                />
                <SettingsButton
                  menu={'server'}
                  type={'end'}
                  section={'channels'}
                  icon={{pack: 'regular', name: 'tag'}}
                  onPress={() => {
                    setSection({section: 'channels'});
                  }}
                />
                <Text type={'h1'}>
                  {t('app.servers.settings.customisation')}
                </Text>
                <SettingsButton
                  menu={'server'}
                  type={'start'}
                  section={'roles'}
                  icon={{pack: 'regular', name: 'flag'}}
                  onPress={() => {
                    setSection({section: 'roles'});
                  }}
                />
                <SettingsButton
                  menu={'server'}
                  type={'end'}
                  section={'emoji'}
                  icon={{pack: 'regular', name: 'emoji-emotions'}}
                  onPress={() => {
                    setSection({section: 'emoji'});
                  }}
                />
                <Text type={'h1'}>
                  {t('app.servers.settings.user_management')}
                </Text>
                <SettingsButton
                  menu={'server'}
                  type={'start'}
                  section={'members'}
                  icon={{pack: 'regular', name: 'group'}}
                  onPress={() => {
                    setSection({section: 'members'});
                  }}
                />
                <SettingsButton
                  menu={'server'}
                  section={'invites'}
                  icon={{pack: 'regular', name: 'mail'}}
                  onPress={() => {
                    setSection({section: 'invites'});
                  }}
                />
                <SettingsButton
                  menu={'server'}
                  type={'end'}
                  section={'bans'}
                  icon={{pack: 'community', name: 'hammer'}}
                  onPress={() => {
                    setSection({section: 'bans'});
                  }}
                />
                {server.owner === client.user?._id ? (
                  <SettingsButton
                  menu={'server'}
                  type={'detatched'}
                  section={'delete_server'}
                  icon={{pack: 'regular', name: 'delete'}}
                  onPress={() => {
                    app.openDeletionConfirmationModal({
                        type: 'Server',
                        object: server,
                      });
                  }}
                />
                ) : null}
              </>
            ) : section.section === 'overview' ? (
              <OverviewSettingsSection server={server} />
            ) : section.section === 'channels' ? (
              <ChannelSettingsSection
                server={server}
                section={section}
                setSection={setSection}
              />
            ) : section.section === 'roles' ? (
              <RoleSettingsSection
                server={server}
                section={section}
                setSection={setSection}
              />
            ) : section.section === 'emoji' ? (
              <EmojiSettingsSection server={server} />
            ) : section.section === 'invites' ? (
              <InviteSettingsSection server={server} />
            ) : section.section === 'bans' ? (
              <BanSettingsSection server={server} />
            ) : null}
          </ScrollView>
        )}
      </View>
    );
  },
);

const generateLocalStyles = (currentTheme: Theme, inset: number) => {
  return StyleSheet.create({
    background: {
      flex: 1,
      marginTop: inset,
      backgroundColor: currentTheme.backgroundPrimary,
      paddingTop: commonValues.sizes.xl,
      paddingInline: commonValues.sizes.xl,
      borderTopLeftRadius: commonValues.sizes.xl,
      borderTopRightRadius: commonValues.sizes.xl,
    },
    serverNameInitials: {
      borderRadius: 5000,
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      height: 80,
      backgroundColor: currentTheme.backgroundSecondary,
      overflow: 'hidden',
    },
  });
};
