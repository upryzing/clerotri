import {useContext, useEffect, useState} from 'react';
import {ImageBackground, Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import type {API, ClientboundNotification, User} from 'revolt.js';

import {client} from '@clerotri/lib/client';
import {Avatar, Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';

const ProfileCardInner = observer(({user}: {user: User}) => {
  const {currentTheme} = useContext(ThemeContext);

  return (
    <>
      <Avatar user={user} size={80} status />
      <View style={{flex: 1, paddingStart: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          {user.display_name ?? user.username}
        </Text>
        <Text
          style={{fontSize: 16, fontWeight: 'bold'}}
          colour={
            user.display_name
              ? currentTheme.foregroundSecondary
              : currentTheme.foregroundPrimary
          }>
          @{user.username}#{user.discriminator}
        </Text>
        {user.status?.text && (
          <Text colour={currentTheme.foregroundSecondary} numberOfLines={1}>
            {user.status?.text}
          </Text>
        )}
      </View>
    </>
  );
});

const ProfileCard = observer(({user}: {user: User}) => {
  const [profile, setProfile] = useState({} as {background?: API.File | null});

  useEffect(() => {
    async function getProfile() {
      const p = await user.fetchProfile();

      setProfile(p);
    }
    getProfile();
  }, [user]);

  return (
    <ImageBackground
      src={profile.background ? client.generateFileURL(profile.background) : ''}
      style={localStyles.bannerBackground}>
      <View
        style={[
          localStyles.cardContainer,
          profile.background && localStyles.cardBackground,
        ]}>
        <ProfileCardInner user={user} />
      </View>
    </ImageBackground>
  );
});

export const ExpandableProfile = observer(({user}: {user: User}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const [expanded, setExpanded] = useState(false);

  const [profile, setProfile] = useState(
    null as {content?: string | null} | null,
  );

  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    async function getProfile() {
      const p = await user.fetchProfile();

      setProfile(p);
    }
    getProfile();
  }, [user, renderCount]);

  useEffect(() => {
    function onNewPacket(p: ClientboundNotification) {
      if (p.type === 'UserUpdate' && p.id === client.user?._id) {
        setRenderCount(count => count + 1);
      }
    }

    function setUpListeners() {
      client.addListener('packet', onNewPacket);
    }

    function cleanupListeners() {
      client.removeListener('packet', onNewPacket);
    }

    try {
      setUpListeners();
    } catch (err) {
      console.log(
        `[NEWMESSAGEVIEW] Error setting up ExpandableProfile listener: ${err}`,
      );
    }

    // called when the preview is unmounted
    return () => cleanupListeners();
  }, []);

  return (
    <View style={localStyles.container}>
      <ProfileCard user={user} />
      <Pressable
        onPress={() => (profile ? setExpanded(!expanded) : null)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: commonValues.sizes.medium,
        }}>
        <MaterialIcon
          name={expanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={'foregroundSecondary'}
        />
        <Text
          style={{alignContent: 'center', fontSize: 16, fontWeight: 'bold'}}
          colour={currentTheme.foregroundSecondary}>
          {t(
            `app.settings_menu.profile.${profile ? (expanded ? 'collapse' : 'expand') : 'loading'}_bio`,
          )}
        </Text>
      </Pressable>
      {expanded && (
        <View style={{padding: commonValues.sizes.medium}}>
          <MarkdownView>{profile?.content}</MarkdownView>
        </View>
      )}
    </View>
  );
});

const localStyles = StyleSheet.create(currentTheme => ({
  container: {
    backgroundColor: currentTheme.background,
    borderRadius: commonValues.sizes.medium,
  },
  bannerBackground: {
    backgroundColor: currentTheme.background,
    borderRadius: commonValues.sizes.medium,
    overflow: 'hidden',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: commonValues.sizes.xl * 2,
  },
  cardBackground: {
    backgroundColor: currentTheme.serverNameBackground,
  },
}));
