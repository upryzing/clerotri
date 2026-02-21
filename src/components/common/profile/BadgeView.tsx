/* eslint-disable no-bitwise */
import {TouchableOpacity, View, type ViewProps} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {ScrollView} from 'react-native-gesture-handler';

import type {User} from 'revolt.js';

import {Text} from '@clerotri/components/common/atoms/Text';
import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';
import {BADGES, USER_IDS} from '@clerotri/lib/consts';
import {commonValues} from '@clerotri/lib/themes';
import {openUrl, showToast} from '@clerotri/lib/utils';

const BadgeWrapper = ({style, ...props}: ViewProps) => {
  return <View style={[localStyles.badge, style]} {...props} />;
};

export const BadgeView = observer(({user}: {user: User}) => {
  const {t} = useTranslation();

  if (!user.badges) {
    return <></>;
  }

  return (
    <View style={{marginBlockEnd: commonValues.sizes.medium}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text type={'profile'}>{t('app.profile.badges')}</Text>
        <MaterialIcon
          name={'help'}
          size={18}
          color={'accentColor'}
          onPress={() =>
            openUrl('https://support.revolt.chat/kb/account/badges')
          }
          style={{marginInlineStart: commonValues.sizes.small}}
        />
      </View>
      <View style={localStyles.badgeListContainer}>
        <ScrollView contentContainerStyle={localStyles.badgeList} horizontal>
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
      </View>
    </View>
  );
});

const localStyles = StyleSheet.create(currentTheme => ({
  badgeListContainer: {
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
}));
