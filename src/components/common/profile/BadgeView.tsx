/* eslint-disable no-bitwise */
import {useState} from 'react';
import {
  type TextProps,
  TouchableOpacity,
  View,
  type ViewProps,
} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {Trans, useTranslation} from 'react-i18next';
import {useMMKVBoolean, useMMKVObject} from 'react-native-mmkv';
import {observer} from 'mobx-react-lite';

import {ScrollView} from 'react-native-gesture-handler';

import type {User} from 'revolt.js';

import {Button} from '@clerotri/components/common/atoms/Button';
import {Link} from '@clerotri/components/common/atoms/Link';
import {Text} from '@clerotri/components/common/atoms/Text';
import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';
import {
  BADGES,
  DONOR_BADGES_INFO,
  PRIVACY_INFO,
  USER_IDS,
} from '@clerotri/lib/consts';
import {APP_VERSION} from '@clerotri/lib/metadata';
import {storage} from '@clerotri/lib/storage';
import {getInstanceURL} from '@clerotri/lib/storage/utils';
import {commonValues} from '@clerotri/lib/themes';
import type {DonorList, DonorTiers} from '@clerotri/lib/types';
import {openUrl, showToast} from '@clerotri/lib/utils';

const donorBadgeColours = {
  bronze: '#c08a54',
  silver: '#b2b3c9',
  gold: '#e6c612',
  platinum: '#9bd6f8',
  diamond: '#38bcf0',
};

const getDonorTier = (list: DonorList, id: string) => {
  for (const tier of Object.keys(list) as DonorTiers[]) {
    if (list[tier].includes(id)) {
      return tier;
    }
  }

  return;
};

const BadgeWrapper = ({style, ...props}: ViewProps) => {
  return <View style={[localStyles.badge, style]} {...props} />;
};

const TextWrapper = ({children}: TextProps) => {
  return (
    <Text useNewText colour={'foregroundSecondary'}>
      {children}
    </Text>
  );
};

const ExtraBadgesNotice = () => {
  const {t} = useTranslation();

  const [messageState, setMessageState] = useState('undecided');

  const instanceURL = getInstanceURL();

  return (
    <View
      style={{
        marginBlockStart: commonValues.sizes.medium,
        marginBlockEnd: commonValues.sizes.large,
        marginInline: commonValues.sizes.large,
        gap: commonValues.sizes.xs,
      }}>
      {messageState !== 'undecided' ? (
        <>
          <Text style={{fontWeight: 'bold'}}>
            {t(`app.profile.extra_badges.${messageState}.title`)}
          </Text>
          <Text useNewText colour={'foregroundSecondary'}>
            {t(`app.profile.extra_badges.${messageState}.body`)}
          </Text>
        </>
      ) : (
        <>
          <Text style={{fontWeight: 'bold'}}>
            {t('app.profile.extra_badges.enable.title')}
          </Text>
          <Trans
            t={t}
            i18nKey={'app.profile.extra_badges.enable.body'}
            tOptions={{url: instanceURL, version: `v${APP_VERSION}`}}
            parent={TextWrapper}>
            Your instance's URL ({{instanceURL}}) and the version of Clerotri
            you're using (v{{APP_VERSION}}) will be sent to Clerotri. They won't
            be stored unless you've enabled analytics.{' '}
            <Link link={PRIVACY_INFO} label={''}>
              Learn more
            </Link>
          </Trans>
          <View
            style={{
              flexDirection: 'row',
              marginBlockStart: commonValues.sizes.medium,
              gap: commonValues.sizes.medium,
            }}>
            <Button
              onPress={() => {
                storage.set('ui.profile.extraBadges', true);
                setMessageState('enabled');
              }}
              style={[
                localStyles.extraBadgesButton,
                localStyles.enableExtraBadgesButton,
              ]}>
              <Text
                useNewText
                style={{fontWeight: 'bold'}}
                colour={'accentColorForeground'}>
                {t('app.profile.extra_badges.enable.accept')}
              </Text>
            </Button>
            <Button
              onPress={() => {
                storage.set('ui.profile.extraBadges', false);
                setMessageState('disabled');
              }}
              style={localStyles.extraBadgesButton}>
              <Text style={{fontWeight: 'bold'}}>
                {t('app.profile.extra_badges.enable.decline')}
              </Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

export const BadgeView = observer(({user}: {user: User}) => {
  const {t} = useTranslation();

  const [extraBadgesEnabled] = useMMKVBoolean('ui.profile.extraBadges');

  const [showConsentPrompt] = useState(extraBadgesEnabled === undefined);

  const [donorList] = useMMKVObject('donorList');

  if (!user.badges && extraBadgesEnabled === false) {
    return <></>;
  }

  const donorTier = donorList
    ? getDonorTier(donorList as DonorList, user._id)
    : undefined;

  return (
    <View style={{marginBlockEnd: commonValues.sizes.medium}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text type={'profile'}>{t('app.profile.badges')}</Text>
        <MaterialIcon
          name={'help'}
          size={18}
          color={'accentColor'}
          onPress={() =>
            openUrl('https://support.stoat.chat/kb/account/badges')
          }
          style={{marginInlineStart: commonValues.sizes.small}}
        />
      </View>
      <View style={localStyles.badgeListContainer}>
        <ScrollView
          style={localStyles.badgeListScrollView}
          contentContainerStyle={localStyles.badgeList}
          horizontal>
          {
            // @ts-expect-error this is fine
            Object.keys(BADGES).map((b: keyof typeof BADGES) => {
              if (user.badges! & BADGES[b]) {
                return (
                  <BadgeWrapper key={b}>
                    <TouchableOpacity
                      onPress={() =>
                        showToast(
                          b.startsWith('ReservedRelevantJokeBadge')
                            ? b === 'ReservedRelevantJokeBadge1'
                              ? 'amogus'
                              : "It's Morbin Time"
                            : t(`app.badges.${b}`),
                        )
                      }
                      onLongPress={() =>
                        b === 'ActiveSupporter' || b === 'Supporter'
                          ? openUrl(
                              'https://wiki.revolt.chat/notes/project/financial-support/',
                            )
                          : null
                      }>
                      {(() => {
                        switch (b) {
                          case 'Founder':
                            return (
                              <MaterialIcon
                                name="star"
                                size={28}
                                customColor={'red'}
                              />
                            );
                          case 'Developer':
                            return (
                              <MaterialIcon
                                name="build"
                                size={28}
                                color={'foregroundSecondary'}
                              />
                            );
                          case 'Translator':
                            return (
                              <MaterialIcon
                                name="translate"
                                size={28}
                                customColor={'green'}
                              />
                            );
                          case 'Supporter':
                            return (
                              <MaterialCommunityIcon
                                name="cash"
                                size={28}
                                customColor={'#80c95b'}
                              />
                            );
                          case 'ActiveSupporter':
                            return (
                              <MaterialCommunityIcon
                                name="cash-sync"
                                size={28}
                                customColor={'#d3dd4c'}
                              />
                            );
                          case 'ResponsibleDisclosure':
                            return (
                              <MaterialCommunityIcon
                                name="bug-check"
                                size={28}
                                customColor={'pink'}
                              />
                            );
                          case 'EarlyAdopter':
                            return (
                              <MaterialCommunityIcon
                                name="beta"
                                size={28}
                                customColor={'cyan'}
                              />
                            );
                          case 'PlatformModeration':
                            return (
                              <MaterialIcon
                                name="gavel"
                                size={28}
                                customColor={'#e04040'}
                              />
                            );
                          case 'Paw':
                            return <Text style={{fontSize: 24}}>✌️</Text>;
                          case 'ReservedRelevantJokeBadge1':
                            return <Text style={{fontSize: 24}}>📮</Text>;
                          case 'ReservedRelevantJokeBadge2':
                            return <Text style={{fontSize: 24}}>🦇</Text>;
                          default:
                            return (
                              <Text
                                useNewText
                                colour={'foregroundSecondary'}
                                style={{
                                  fontSize: 8,
                                }}>
                                [{b}]
                              </Text>
                            );
                        }
                      })()}
                    </TouchableOpacity>
                  </BadgeWrapper>
                );
              }
            })
          }
          {USER_IDS.developers.includes(user._id) ? (
            <BadgeWrapper key={'clerotri-dev'}>
              <TouchableOpacity
                onPress={() => showToast(t('app.custom_badges.clerotri_dev'))}>
                <MaterialCommunityIcon
                  name="flower"
                  size={28}
                  color={'accentColor'}
                />
              </TouchableOpacity>
            </BadgeWrapper>
          ) : null}
          {extraBadgesEnabled && donorTier ? (
            <BadgeWrapper key={'clerotri-donor'}>
              <TouchableOpacity
                onPress={() =>
                  showToast(t(`app.custom_badges.clerotri_donor.${donorTier}`))
                }
                onLongPress={() => openUrl(DONOR_BADGES_INFO)}>
                <MaterialCommunityIcon
                  name="flower-pollen"
                  size={28}
                  customColor={donorBadgeColours[donorTier]}
                />
              </TouchableOpacity>
            </BadgeWrapper>
          ) : null}
          {user._id === USER_IDS.teamMembers.lea ? (
            <BadgeWrapper key={'lea-paw'}>
              <TouchableOpacity onPress={() => showToast("Lea's Paw")}>
                <MaterialCommunityIcon
                  name={'paw'}
                  size={28}
                  color={'foregroundSecondary'}
                />
              </TouchableOpacity>
            </BadgeWrapper>
          ) : null}
          {user._id === USER_IDS.teamMembers.insert ? (
            <BadgeWrapper key={'insert-raccoon'}>
              <TouchableOpacity onPress={() => showToast('raccoon 🦝')}>
                <Text style={{fontSize: 24}}>🦝</Text>
              </TouchableOpacity>
            </BadgeWrapper>
          ) : null}
          {user._id === USER_IDS.teamMembers.infi ? (
            <BadgeWrapper key={'infi-octopus'}>
              <TouchableOpacity onPress={() => showToast('ink-fi')}>
                <Text style={{fontSize: 24}}>🐙</Text>
              </TouchableOpacity>
            </BadgeWrapper>
          ) : null}
        </ScrollView>
        {showConsentPrompt && <ExtraBadgesNotice />}
      </View>
    </View>
  );
});

const localStyles = StyleSheet.create(currentTheme => ({
  badgeListContainer: {
    backgroundColor: currentTheme.background,
    borderRadius: commonValues.sizes.medium,
  },
  badgeListScrollView: {
    backgroundColor: currentTheme.backgroundPrimary,
    borderRadius: commonValues.sizes.medium,
  },
  badgeList: {
    padding: commonValues.sizes.medium,
    alignItems: 'center',
    gap: commonValues.sizes.medium,
  },
  badge: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraBadgesButton: {
    margin: 0,
    flex: 1,
  },
  enableExtraBadgesButton: {
    backgroundColor: currentTheme.accentColor,
  },
}));
