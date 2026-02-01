import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

import {AppIcon} from '@clerotri/components/common/settings/sections/app/AppInfoDecorations';
import {Button, Text} from '@clerotri/components/common/atoms';
import {getInstanceURL} from '@clerotri/lib/storage/utils';
import {commonValues} from '@clerotri/lib/themes';

const StartPage = () => {
  const {t} = useTranslation();

  return (
    <View style={{alignItems: 'center'}}>
      {/* <Trans t={t} i18nKey={'app.modals.confirm_deletion.body_server'}><AppIcon height={80} width={80} /></Trans> */}
      <AppIcon height={120} width={120} />
      <Text style={localStyles.appName}>Clerotri</Text>
      <Text
        useNewText
        colour={'foregroundSecondary'}
        style={{fontWeight: 'bold'}}>
        for Upryzing and Stoat
      </Text>
      <Text
        style={{
          marginVertical: commonValues.sizes.medium,
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        {t('app.login.subheader')}
      </Text>
      <Button
        onPress={() => {
          //   openUrl(
          //     client.configuration
          //       ? `${client.configuration.app}/login/create`
          //       : OFFICIAL_INSTANCE_SIGNUP_URL,
          //   );
        }}
        style={[localStyles.startPageButton, localStyles.signUpButton]}>
        <View style={{alignItems: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
            {t('app.login.options.signup')}
          </Text>
          <Text style={{textAlign: 'center'}}>
            {t('app.login.options.signup_body')}
          </Text>
        </View>
      </Button>
      <Button
        onPress={() => {
          //   setLoginType('email');
        }}
        style={localStyles.startPageButton}>
        <View style={{alignItems: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
            {t('app.login.options.login_regular')}
          </Text>
          {/* <Text style={{textAlign: 'center'}}>
            {t('app.login.options.login_regular_body')}
          </Text> */}
        </View>
      </Button>
      <Text useNewText colour={'foregroundSecondary'}>
        {t('app.login.instance_notice', {
          url: getInstanceURL(),
        })}
      </Text>
    </View>
  );
};

export const LoginPageV2 = () => {
  return (
    <KeyboardAvoidingView behavior={'padding'} style={localStyles.container}>
      <StartPage />
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
  subtitle: {
    fontWeight: 'bold',
  },
  startPageButton: {
    width: '80%',
  },
  signUpButton: {
    border: `${currentTheme.accentColor}`,
  },
}));
