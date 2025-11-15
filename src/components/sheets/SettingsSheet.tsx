import {useContext, useMemo, useState} from 'react';
import {type GradientValue, Platform, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';
import {
  getApiLevelSync,
  getBrand,
  getDeviceSync,
  getUserAgentSync,
} from 'react-native-device-info';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {app, setFunction} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {DONATIONS_INFO, OPEN_ISSUES, WEBLATE} from '@clerotri/lib/consts';
import {APP_VERSION} from '@clerotri/lib/metadata';
import {getSettingsObject} from '@clerotri/lib/settings';
import {getInstanceURL} from '@clerotri/lib/storage/utils';
import {commonValues, type Theme, ThemeContext} from '@clerotri/lib/themes';
import {SettingsSection} from '@clerotri/lib/types';
import {openUrl} from '@clerotri/lib/utils';
import {BackButton, Text} from '@clerotri/components/common/atoms';
import {SettingsButton} from '@clerotri/components/common/buttons';
import {SettingsCategory} from '@clerotri/components/common/settings';
import {
  AppInfoSection,
  AccountSettingsSection,
  BotSettingsSection,
  LicenseListSection,
  ProfileSettingsSection,
  SessionsSettingsSection,
} from '@clerotri/components/common/settings/sections/app';

function copyDebugInfo() {
  const obj = {
    deviceInfo: {
      time: new Date().getTime(),
      platform: Platform.OS,
      model:
        Platform.OS === 'android' ? `${getBrand()}/${getDeviceSync()}` : 'N/A',
      browser: Platform.OS === 'web' ? `${getUserAgentSync()}` : 'N/A',
      version: Platform.OS === 'android' ? `${getApiLevelSync()}` : 'N/A',
    },

    appInfo: {
      instance: getInstanceURL(),
      userID: client.user?._id ?? 'ERR_ID_UNDEFINED',
      settings: getSettingsObject(),
      version: APP_VERSION,
    },
  };

  Clipboard.setString(JSON.stringify(obj));
}

export const generateDonateGradient = (currentTheme: Theme): GradientValue => {
  return {
    type: 'linear-gradient',
    direction: '120deg',
    colorStops: [
      {color: '#00000000'},
      {color: `${currentTheme.accentColor}80`},
    ],
  };
};

// this ensures things don't bork if an invalid section is provided by `initialSection`
const VALID_SECTIONS = [
  'account',
  'appearance',
  'bots',
  'functionality',
  'info',
  'i18n',
  'licenses',
  'profile',
  'sessions',
];

const FLEX_CONTAINER_SECTIONS = ['bots', 'info', 'sessions'];

export const SettingsSheet = observer(
  ({
    initialSection,
    setState,
  }: {
    initialSection: SettingsSection | null;
    setState: Function;
  }) => {
    const insets = useSafeAreaInsets();

    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    // this feels Cursed but if someone opens a broken URL I'd rather not have things break in weird ways
    const [section, setSection] = useState(
      !!initialSection && VALID_SECTIONS.includes(initialSection.section)
        ? initialSection
        : null,
    );

    setFunction(
      'handleSettingsVisibility',
      (setVisibility: (state: boolean) => void) => {
        if (section) {
          setSection(section.subsection ? {section: section.section} : null);
        } else {
          setVisibility(false);
        }
      },
    );

    const donateGradient = useMemo(
      () => generateDonateGradient(currentTheme),
      [currentTheme],
    );

    return (
      <View
        style={{
          flex: 1,
          marginTop: insets.top,
          backgroundColor: currentTheme.backgroundPrimary,
          paddingTop: commonValues.sizes.xl,
          paddingInline: commonValues.sizes.xl,
          borderTopLeftRadius: commonValues.sizes.xl,
          borderTopRightRadius: commonValues.sizes.xl,
        }}>
        {section?.section !== 'bots' && (
          <BackButton
            callback={() =>
              section === null
                ? setState()
                : setSection(
                    section.subsection
                      ? {
                          section: section.section,
                          subsection: undefined,
                        }
                      : null,
                  )
            }
            type={section === null ? 'close' : 'back'}
            margin
          />
        )}
        {section ? (
          <>
            {section?.section !== 'bots' && (
              <Text type={'h1'}>
                {t(`app.settings_menu.${section.section}.title`)}
              </Text>
            )}
            {section.section === 'licenses' ? (
              <LicenseListSection />
            ) : (
              <ScrollView
                style={{
                  flex: 1,
                }}
                contentContainerStyle={[
                  {
                    paddingBottom: commonValues.sizes.xl + insets.bottom,
                  },
                  FLEX_CONTAINER_SECTIONS.includes(section.section) && {
                    flexGrow: 1,
                  },
                ]}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                {section.section === 'appearance' ? (
                  <SettingsCategory category={'appearance'} />
                ) : section.section === 'functionality' ? (
                  <SettingsCategory category={'functionality'} />
                ) : section.section === 'i18n' ? (
                  <SettingsCategory category={'i18n'} />
                ) : section.section === 'account' ? (
                  <AccountSettingsSection />
                ) : section.section === 'profile' ? (
                  <ProfileSettingsSection />
                ) : section.section === 'sessions' ? (
                  <SessionsSettingsSection />
                ) : section.section === 'bots' ? (
                  <BotSettingsSection
                    section={section}
                    setSection={setSection}
                  />
                ) : (
                  <AppInfoSection />
                )}
              </ScrollView>
            )}
          </>
        ) : (
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={[
              {
                paddingBottom: commonValues.sizes.xl + insets.bottom,
              },
            ]}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <>
              <Text type={'h1'}>{t('app.settings_menu.groups.user')}</Text>
              <SettingsButton
                menu={'app'}
                type={'start'}
                section={'account'}
                icon={{pack: 'regular', name: 'person'}}
                onPress={() => {
                  setSection({section: 'account'});
                }}
              />
              <SettingsButton
                menu={'app'}
                section={'profile'}
                icon={{pack: 'community', name: 'card-account-details'}}
                onPress={() => {
                  setSection({section: 'profile'});
                }}
              />
              <SettingsButton
                menu={'app'}
                section={'sessions'}
                icon={{pack: 'community', name: 'shield-check'}}
                onPress={() => {
                  setSection({section: 'sessions'});
                }}
              />
              {__DEV__ && (
                <SettingsButton
                  menu={'app'}
                  type={'end'}
                  section={'bots'}
                  icon={{pack: 'community', name: 'robot'}}
                  onPress={() => {
                    setSection({section: 'bots'});
                  }}
                />
              )}
              <Text type={'h1'}>{t('app.settings_menu.groups.app')}</Text>
              <SettingsButton
                menu={'app'}
                type={'start'}
                section={'appearance'}
                icon={{pack: 'regular', name: 'palette'}}
                onPress={() => {
                  setSection({section: 'appearance'});
                }}
              />
              <SettingsButton
                menu={'app'}
                section={'functionality'}
                icon={{pack: 'regular', name: 'build'}}
                onPress={() => {
                  setSection({section: 'functionality'});
                }}
              />
              <SettingsButton
                menu={'app'}
                section={'i18n'}
                icon={{pack: 'regular', name: 'translate'}}
                onPress={() => {
                  setSection({section: 'i18n'});
                }}
              />
              <SettingsButton
                menu={'app'}
                type={'end'}
                section={'analytics'}
                icon={{pack: 'regular', name: 'analytics'}}
                onPress={() => {
                  app.openAnalyticsMenu(true);
                }}
              />
              <Text type={'h1'}>{t('app.settings_menu.groups.advanced')}</Text>
              <SettingsButton
                menu={'app-other'}
                type={'detatched'}
                section={'debug_info'}
                icon={{pack: 'regular', name: 'bug-report'}}
                onPress={() => {
                  copyDebugInfo();
                }}
              />
              <Text type={'h1'}>{t('app.settings_menu.groups.other')}</Text>
              <SettingsButton
                menu={'app'}
                type={'start'}
                section={'info'}
                icon={{pack: 'regular', name: 'info'}}
                onPress={() => {
                  setSection({section: 'info'});
                }}
              />
              <SettingsButton
                menu={'app-other'}
                section={'changelog'}
                icon={{pack: 'community', name: 'newspaper'}}
                onPress={() => {
                  setState();
                  app.openChangelog(true);
                }}
              />
              <SettingsButton
                menu={'app'}
                type={'end'}
                section={'licenses'}
                icon={{pack: 'community', name: 'license'}}
                onPress={() => {
                  setSection({section: 'licenses'});
                }}
              />
              <SettingsButton
                menu={'app-other'}
                type={'detatched'}
                section={'donate'}
                icon={{
                  pack: 'community',
                  name: 'heart',
                  colour: currentTheme.accentColor,
                }}
                style={{experimental_backgroundImage: [donateGradient]}}
                onPress={() => {
                  openUrl(DONATIONS_INFO);
                }}
              />
              <SettingsButton
                menu={'app-other'}
                type={'start'}
                section={'translate'}
                icon={{pack: 'community', name: 'translate-variant'}}
                onPress={() => {
                  openUrl(WEBLATE);
                }}
              />
              <SettingsButton
                menu={'app-other'}
                type={'end'}
                section={'view_issues'}
                icon={{pack: 'community', name: 'github'}}
                onPress={() => {
                  openUrl(OPEN_ISSUES);
                }}
              />
              <SettingsButton
                menu={'app-other'}
                type={'detatched'}
                section={'logout'}
                textColour={currentTheme.error}
                icon={{
                  pack: 'regular',
                  name: 'logout',
                  colour: currentTheme.error,
                }}
                style={{marginBlockEnd: 0}}
                onPress={() => {
                  setState();
                  app.logOut();
                }}
              />
            </>
          </ScrollView>
        )}
      </View>
    );
  },
);
