import {useContext, useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';
import {
  getApiLevel,
  getBrand,
  getDevice,
  getUserAgent,
} from 'react-native-device-info';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {app, appVersion, setFunction} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {OPEN_ISSUES} from '@clerotri/lib/consts';
import {storage} from '@clerotri/lib/storage';
import {getInstanceURL} from '@clerotri/lib/storage/utils';
import {ThemeContext} from '@clerotri/lib/themes';
import {SettingsSection} from '@clerotri/lib/types';
import {openUrl} from '@clerotri/lib/utils';
import {styles} from '@clerotri/Theme';
import {
  BackButton,
  ContextButton,
  Text,
} from '@clerotri/components/common/atoms';
import {SettingsCategory} from '@clerotri/components/common/settings';
import {
  AppInfoSection,
  AccountSettingsSection,
  LicenseListSection,
  ProfileSettingsSection,
} from '@clerotri/components/common/settings/sections/app';

async function copyDebugInfo() {
  const obj = {
    deviceInfo: {
      time: new Date().getTime(),
      platform: Platform.OS,
      model:
        Platform.OS === 'android'
          ? `${getBrand()}/${await getDevice()}`
          : 'N/A',
      browser: Platform.OS === 'web' ? `${await getUserAgent()}` : 'N/A',
      version: Platform.OS === 'android' ? `${await getApiLevel()}` : 'N/A',
    },

    appInfo: {
      instance: getInstanceURL(),
      userID: client.user?._id ?? 'ERR_ID_UNDEFINED',
      settings: storage.getString('settings'),
      version: appVersion,
    },
  };

  Clipboard.setString(JSON.stringify(obj));
}

function copyDebugInfoWrapper() {
  copyDebugInfo().then(() => {
    return null;
  });
}

export const SettingsSheet = observer(({setState}: {setState: Function}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const [section, setSection] = useState(null as SettingsSection);

  setFunction(
    'handleSettingsVisibility',
    (setVisibility: (state: boolean) => void) => {
      if (section) {
        setSection(null);
      } else {
        setVisibility(false);
      }
    },
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentTheme.backgroundPrimary,
        padding: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}>
      <BackButton
        callback={() => (section === null ? setState() : setSection(null))}
        type={section === null ? 'close' : 'back'}
        margin
      />
      {section ? (
        <>
          <Text type={'h1'}>
            {t(`app.settings_menu.${section.section}.title`)}
          </Text>
          {section.section === 'licenses' ? (
            <LicenseListSection />
          ) : (
            <ScrollView
              style={{
                flex: 1,
              }}
              contentContainerStyle={
                section.section === 'info'
                  ? {
                      flex: 1,
                    }
                  : null
              }
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
              ) : (
                <AppInfoSection />
              )}
            </ScrollView>
          )}
        </>
      ) : (
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <>
            <Text type={'h1'}>{t('app.settings_menu.groups.user')}</Text>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection({section: 'account'});
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'person'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.account.title')}</Text>
            </ContextButton>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection({section: 'profile'});
              }}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcon
                  name={'card-account-details'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.profile.title')}</Text>
            </ContextButton>
            <Text type={'h1'}>{t('app.settings_menu.groups.app')}</Text>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection({section: 'appearance'});
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'palette'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.appearance.title')}</Text>
            </ContextButton>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection({section: 'functionality'});
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'build'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.functionality.title')}</Text>
            </ContextButton>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection({section: 'i18n'});
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'translate'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.i18n.title')}</Text>
            </ContextButton>
            <Text type={'h1'}>{t('app.settings_menu.groups.advanced')}</Text>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                copyDebugInfoWrapper();
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'bug-report'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.other.debug_info')}</Text>
            </ContextButton>
            <Text type={'h1'}>{t('app.settings_menu.groups.other')}</Text>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection({section: 'info'});
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'info'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.info.title')}</Text>
            </ContextButton>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection({section: 'licenses'});
              }}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcon
                  name={'license'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.licenses.title')}</Text>
            </ContextButton>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                openUrl(OPEN_ISSUES);
              }}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcon
                  name={'github'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.other.view_issues')}</Text>
            </ContextButton>
            <ContextButton
              style={{flex: 1}}
              backgroundColor={currentTheme.error}
              onPress={() => {
                setState();
                app.logOut();
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'logout'}
                  color={currentTheme.foregroundPrimary}
                  size={24}
                />
              </View>
              <Text>{t('app.settings_menu.other.logout')}</Text>
            </ContextButton>
          </>
        </ScrollView>
      )}
    </View>
  );
});
