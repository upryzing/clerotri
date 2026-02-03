import {createContext, useContext, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

import {AppIcon} from '@clerotri/components/common/settings/sections/app/AppInfoDecorations';
import {Button, Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {OFFICIAL_INSTANCE_SIGNUP_URL} from '@clerotri/lib/consts';
import {client} from '@clerotri/lib/client';
import {getInstanceURL} from '@clerotri/lib/storage/utils';
import {commonValues} from '@clerotri/lib/themes';
import {openUrl} from '@clerotri/lib/utils';
import {LoginSettingsPage} from '@clerotri/pages/auth/LoginSettingsPage';

type LoginPage = 'start' | 'login' | 'login_token' | 'settings';

export const LoginPageContext = createContext<{
  currentPage: LoginPage;
  setCurrentPage: Function;
}>({currentPage: 'start', setCurrentPage: () => {}});

const StartPage = () => {
  const {t} = useTranslation();

  const {setCurrentPage} = useContext(LoginPageContext);

  return (
    <View style={{alignItems: 'center'}}>
      {/* <Trans t={t} i18nKey={'app.modals.confirm_deletion.body_server'}><AppIcon height={80} width={80} /></Trans> */}
      <AppIcon height={120} width={120} />
      <Text style={localStyles.appName}>Clerotri</Text>
      <Text useNewText colour={'foregroundSecondary'}>
        for Upryzing and Stoat
      </Text>
      <Text style={localStyles.question}>{t('app.login.subheader')}</Text>
      <View style={localStyles.buttonsContainer}>
        <Button
          onPress={() => {
            openUrl(
              client.configuration
                ? `${client.configuration.app}/login/create`
                : OFFICIAL_INSTANCE_SIGNUP_URL,
            );
          }}
          style={localStyles.startPageButton}>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
              {t('app.login.options.signup')}
            </Text>
            <Text style={{textAlign: 'center'}}>
              {t('app.login.options.signup_body')}
            </Text>
          </View>
        </Button>
        <Button
          onPress={() => {
            setCurrentPage('login');
          }}
          style={localStyles.startPageButton}>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
              {t('app.login.options.login_regular')}
            </Text>
            {/* <Text style={{textAlign: 'center'}}>
            {t('app.login.options.login_regular_body')}
          </Text> */}
          </View>
        </Button>
      </View>
      <Text useNewText colour={'foregroundSecondary'}>
        {t('app.login.instance_notice', {
          url: getInstanceURL(),
        })}
      </Text>
      <Button
        onPress={() => {
          setCurrentPage('settings');
        }}
        style={[localStyles.startPageButton, localStyles.settingsButton]}>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <MaterialIcon
            name={'settings'}
            color={'foregroundSecondary'}
            size={20}
          />
          <Text
            useNewText
            colour={'foregroundSecondary'}
            style={{
              fontWeight: 'bold',
              marginInlineStart: commonValues.sizes.small,
            }}>
            {t('app.login.settings_button')}
          </Text>
        </View>
      </Button>
    </View>
  );
};

export const LoginPageV2 = () => {
  const [currentPage, setCurrentPage] = useState<LoginPage>('start');

  return (
    <KeyboardAvoidingView behavior={'padding'} style={localStyles.container}>
      <LoginPageContext.Provider value={{currentPage, setCurrentPage}}>
        {currentPage === 'settings' ? (
          <LoginSettingsPage
            callback={() => setCurrentPage('start')}
            isV2
            temporarySessionTokenFunction={() => setCurrentPage('login_token')}
          />
        ) : (
          <StartPage />
        )}
      </LoginPageContext.Provider>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  container: {
    flex: 1,
    backgroundColor: currentTheme.backgroundPrimary,
    justifyContent: 'center',
  },
  appName: {
    marginBlockStart: commonValues.sizes.medium,
    fontWeight: 'bold',
    fontSize: 40,
  },
  question: {
    marginBlockStart: commonValues.sizes.xl,
    marginBlockEnd: commonValues.sizes.small,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginBlock: commonValues.sizes.small,
  },
  startPageButton: {
    width: '80%',
    margin: 0,
    marginBlock: commonValues.sizes.small,
  },
  settingsButton: {
    padding: commonValues.sizes.medium,
    backgroundColor: '#00000000',
  },
}));
