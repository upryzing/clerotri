import {useContext, useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import type {API} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {
  PressableSettingsEntry,
  SettingsEntry,
} from '@clerotri/components/common/settings/atoms';
import {GapView, LineSeparator} from '@clerotri/components/layout';
import {storage} from '@clerotri/lib/storage';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

const SessionEntry = observer(
  ({
    session,
    sessionID,
    onDelete,
  }: {
    session: API.SessionInfo;
    sessionID?: string;
    onDelete: (s: API.SessionInfo) => void;
  }) => {
    return (
      <SettingsEntry>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <Text
            key={`sessions-${session._id}-name`}
            style={{fontWeight: 'bold'}}>
            {session.name} {session.name.match(/(RVMob|Clerotri)/) ? '✨' : ''}
          </Text>
          <Text key={`sessions-${session._id}-id`}>{session._id}</Text>
        </View>
        <Pressable
          style={{
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            app.openTextEditModal({
              initialString: session.name,
              id: 'session_name',
              callback: newName => {
                client.api.patch(`/auth/session/${session._id}`, {
                  friendly_name: newName,
                });
              },
            });
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="edit" size={20} />
          </View>
        </Pressable>
        {sessionID !== session._id ? (
          <Pressable
            style={{
              width: 30,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => onDelete(session)}>
            <View style={styles.iconContainer}>
              <MaterialIcon name="logout" size={20} />
            </View>
          </Pressable>
        ) : null}
      </SettingsEntry>
    );
  },
);

export const SessionsSettingsSection = observer(() => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const sessionID = storage.getString('sessionID');
  const [sessions, setSessions] = useState<API.SessionInfo[] | null>(null);

  useEffect(() => {
    async function getSessions() {
      const s = await client.api.get('/auth/session/all');
      setSessions(s);
    }
    getSessions();
  }, []);

  const currentSession = sessionID
    ? sessions?.find(s => s._id === sessionID)
    : undefined;

  return (
    <>
      {sessions ? (
        <>
          <Text type={'h2'}>
            {t('app.settings_menu.sessions.current_session')}
          </Text>
          {currentSession ? (
            <SessionEntry
              key={`sessions-${currentSession._id}`}
              session={currentSession}
              sessionID={sessionID}
              onDelete={() => {}}
            />
          ) : (
            <Text>
              {t(
                `app.settings_menu.sessions.current_session_not_found${sessionID && '_with_hint'}`,
              )}
            </Text>
          )}
          <GapView size={4} />
          <Text type={'h2'}>
            {t('app.settings_menu.sessions.other_sessions')}
          </Text>
          {sessions.filter(ses => ses._id !== sessionID).length ? (
            <>
              <PressableSettingsEntry
                style={{backgroundColor: currentTheme.error}}
                onPress={() => {
                  client.api.delete('/auth/session/all');
                }}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {t('app.settings_menu.sessions.remove_other_sessions')}
                  </Text>
                  <Text>
                    {t('app.settings_menu.sessions.remove_other_sessions_body')}
                  </Text>
                </View>
                <View
                  style={{
                    width: 30,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={styles.iconContainer}>
                    <MaterialIcon name="arrow-forward" size={20} />
                  </View>
                </View>
              </PressableSettingsEntry>
              <LineSeparator style={{margin: commonValues.sizes.medium}} />
              {sessions.map(
                s =>
                  s._id !== sessionID && (
                    <SessionEntry
                      key={`sessions-${s._id}`}
                      session={s}
                      sessionID={sessionID}
                      onDelete={async session => {
                        await client.api.delete(`/auth/session/${session._id}`);
                        setSessions(
                          sessions.filter(ses => ses._id !== session._id),
                        );
                      }}
                    />
                  ),
              )}
            </>
          ) : (
            <Text>{t('app.settings_menu.sessions.no_other_sessions')}</Text>
          )}
        </>
      ) : (
        <View style={styles.loadingScreen}>
          <Text type={'h1'}>{t('app.settings_menu.sessions.loading')}</Text>
        </View>
      )}
    </>
  );
});
