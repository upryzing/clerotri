import {useEffect, useState} from 'react';
import {ImageBackground, Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import type {API, ClientboundNotification, User} from 'revolt.js';

import {client} from '@clerotri/lib/client';
import {Avatar, Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {commonValues} from '@clerotri/lib/themes';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';

const ProfileCardInner = observer(({user}: {user: User}) => {
  return (
    <>
      <Avatar user={user} size={80} status />
      <View style={{flex: 1, paddingStart: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          {user.display_name ?? user.username}
        </Text>
        <Text
          useNewText
          style={{fontSize: 16, fontWeight: 'bold'}}
          colour={user.display_name ? 'foregroundSecondary' : undefined}>
          @{user.username}#{user.discriminator}
        </Text>
        {user.status?.text && (
          <Text useNewText colour={'foregroundSecondary'} numberOfLines={1}>
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

export const ExpandableProfile = observer(
  ({user, botToken}: {user: User; botToken?: string}) => {
    const {t} = useTranslation();

    const [expanded, setExpanded] = useState(false);

    const [profile, setProfile] = useState<API.UserProfile | null>(null);

    const [error, setError] = useState<unknown>(null);

    const [renderCount, setRenderCount] = useState(0);

    useEffect(() => {
      async function getProfile() {
        try {
          const p = await client.api.get(
            `/users/${user._id as ''}/profile`,
            undefined,
            botToken ? {headers: {'X-Bot-Token': botToken}} : undefined,
          );

          setProfile(p);
        } catch (err) {
          console.log(`[EXPANDABLEPROFILE] Failed to fetch bio: ${err}`);
          setError(err);
        }
      }
      getProfile();
    }, [user, renderCount, botToken]);

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
        <View style={localStyles.bioSectionContainer}>
          <Pressable
            onPress={() => (error || profile ? setExpanded(!expanded) : null)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialIcon
              name={error ? 'error' : expanded ? 'expand-less' : 'expand-more'}
              size={24}
              color={'foregroundSecondary'}
            />
            <Text
              useNewText
              style={{
                alignContent: 'center',
                paddingInlineStart: commonValues.sizes.small,
                fontSize: 16,
                fontWeight: 'bold',
              }}
              colour={'foregroundSecondary'}>
              {t(
                `app.settings_menu.profile.${profile ? (expanded ? 'collapse' : 'expand') : error ? 'failed_to_load' : 'loading'}_bio`,
              )}
            </Text>
          </Pressable>
          {expanded &&
            (error ? (
              <View>
                <Text
                  useNewText
                  style={{
                    fontWeight: 'bold',
                  }}
                  colour={'foregroundSecondary'}>
                  {t(`app.settings_menu.profile.error_details`)}
                </Text>
                <Text useNewText colour={'error'} font={'JetBrains Mono'}>
                  {JSON.stringify(error)}
                </Text>
              </View>
            ) : (
              <MarkdownView>{profile?.content}</MarkdownView>
            ))}
        </View>
      </View>
    );
  },
);

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
  bioSectionContainer: {
    padding: commonValues.sizes.medium,
    gap: commonValues.sizes.medium,
  },
}));
