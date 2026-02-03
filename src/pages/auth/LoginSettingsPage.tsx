import {useContext, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
// import {useTranslation} from 'react-i18next';
import {useMMKVString} from 'react-native-mmkv';

import {languages} from '@clerotri-i18n/languages';
import {
  BackButton,
  Button,
  Input,
  Text,
} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {PressableSettingsEntry} from '@clerotri/components/common/settings/atoms';
import {SettingsCategory} from '@clerotri/components/common/settings';
import {LineSeparator} from '@clerotri/components/layout';
import {LoadingScreen} from '@clerotri/components/views/LoadingScreen';
import {DEFAULT_API_URL} from '@clerotri/lib/consts';
import {storage} from '@clerotri/lib/storage';
import {getInstanceURL} from '@clerotri/lib/storage/utils';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {useBackHandler} from '@clerotri/lib/ui';

const InstanceSwitcher = ({callback}: {callback: () => void}) => {
  const {currentTheme} = useContext(ThemeContext);

  const [instanceURL, setInstanceURL] = useState(getInstanceURL());
  const [testResponse, setTestResponse] = useState(null as string | null);

  const [saved, setSaved] = useState(false);

  useBackHandler(() => {
    if (!saved) {
      callback();
    }

    return true;
  });

  async function testURL(url: string, returnIfSuccessful: boolean) {
    try {
      console.log('[LOGINSETTINGS] Testing URL...');
      const req = await fetch(url);
      console.log('[LOGINSETTINGS] Request succeeded!');
      const data = await req.json();
      if (data.revolt && data.features) {
        console.log('[LOGINSETTINGS] This looks like a Revolt instance!');
        setTestResponse('valid');
        if (returnIfSuccessful) {
          return true;
        }
      } else {
        console.log(
          "[LOGINSETTINGS] This doesn't look like a Revolt instance...",
        );
        setTestResponse('invalid');
      }
    } catch (err: any) {
      if (err.toString().match('Network request failed')) {
        console.log(`[LOGINSETTINGS] Could not fetch ${instanceURL}`);
        setTestResponse('requestFailed');
      } else if (err.toString().match('JSON Parse error')) {
        console.log(
          "[LOGINSETTINGS] Could not parse the response (it's probably HTML)",
        );
        setTestResponse('notJSON');
      } else {
        console.log(err);
        setTestResponse('error');
      }
    }
  }

  return (
    <>
      {!saved && (
        <BackButton
          callback={() => callback()}
          style={{
            padding: commonValues.sizes.large,
          }}
        />
      )}
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        {saved ? (
          <LoadingScreen
            header={'app.login.settings.saved'}
            body={'app.login.settings.saved_body'}
            styles={{remark: {color: currentTheme.foregroundPrimary}}}
          />
        ) : (
          <>
            <Text type={'h1'}>Instance</Text>
            <Input
              isLoginInput
              skipRegularStyles
              placeholderTextColor={currentTheme.foregroundSecondary}
              placeholder={'Instance URL'}
              onChangeText={text => {
                setInstanceURL(text);
              }}
              value={instanceURL}
            />
            {testResponse ? (
              <Text style={{textAlign: 'center', marginHorizontal: 30}}>
                {testResponse === 'valid'
                  ? 'This looks like a Revolt instance!'
                  : testResponse === 'invalid'
                    ? "This doesn't look like a Revolt instance..."
                    : testResponse === 'notJSON'
                      ? "Could not parse response. Make sure you're linking to the API URL!"
                      : testResponse === 'requestFailed'
                        ? 'Could not fetch that URL.'
                        : 'Something went wrong!'}
              </Text>
            ) : null}
            <Button
              onPress={async () => {
                await testURL(instanceURL, false);
              }}>
              <Text>Test URL</Text>
            </Button>
            <Button
              onPress={async () => {
                const isValid = await testURL(instanceURL, true);
                if (isValid) {
                  console.log(`[AUTH] Setting instance URL to ${instanceURL}`);
                  storage.set('instanceURL', instanceURL);
                  setSaved(true);
                }
              }}>
              <Text>Save</Text>
            </Button>
          </>
        )}
      </View>
    </>
  );
};

export const LoginSettingsPage = ({
  callback,
  isV2,
  temporarySessionTokenFunction,
}: {
  callback: () => void;
  isV2?: boolean;
  temporarySessionTokenFunction?: () => void;
}) => {
  // const {t} = useTranslation();

  const [currentSection, setCurrentSection] = useState<
    'instanceSwitcher' | 'languageSwitcher' | null
  >(null);

  const [currentInstance] = useMMKVString('instanceURL');
  const [currentLanguage] = useMMKVString('app.language');

  useBackHandler(() => {
    if (currentSection) {
      setCurrentSection(null);
      return true;
    }

    callback();
    return true;
  });

  return (
    <View style={localStyles.container}>
      {currentSection !== 'instanceSwitcher' && (
        <BackButton
          callback={() =>
            currentSection ? setCurrentSection(null) : callback()
          }
          type={currentSection ? 'back' : 'close'}
          style={{
            padding: commonValues.sizes.large,
          }}
        />
      )}
      {currentSection === 'instanceSwitcher' ? (
        <InstanceSwitcher callback={() => setCurrentSection(null)} />
      ) : currentSection === 'languageSwitcher' ? (
        <ScrollView contentContainerStyle={{padding: commonValues.sizes.xl}}>
          <SettingsCategory category={'i18n'} skipMargin />
        </ScrollView>
      ) : (
        <View style={{paddingInline: commonValues.sizes.xl}}>
          <PressableSettingsEntry
            onPress={() => setCurrentSection('instanceSwitcher')}>
            <MaterialIcon name={'link'} size={24} />
            <View style={{marginStart: commonValues.sizes.medium}}>
              <Text style={{fontWeight: 'bold'}}>Instance</Text>
              <Text useNewText colour={'foregroundSecondary'}>
                {currentInstance ?? DEFAULT_API_URL}
              </Text>
            </View>
          </PressableSettingsEntry>
          <PressableSettingsEntry
            onPress={() => setCurrentSection('languageSwitcher')}>
            <MaterialIcon name={'translate'} size={24} />
            <View style={{marginStart: commonValues.sizes.medium}}>
              <Text style={{fontWeight: 'bold'}}>Language</Text>
              <Text useNewText colour={'foregroundSecondary'}>
                {languages[currentLanguage ?? 'en'].name}
              </Text>
            </View>
          </PressableSettingsEntry>
          {isV2 && (
            <>
              <LineSeparator style={{margin: commonValues.sizes.medium}} />
              <PressableSettingsEntry
                onPress={() => temporarySessionTokenFunction!()}>
                <MaterialIcon name={'key'} size={24} />
                <View style={{marginStart: commonValues.sizes.medium}}>
                  <Text style={{fontWeight: 'bold'}}>
                    Log in with a session token
                  </Text>
                  <Text useNewText colour={'foregroundSecondary'}>
                    Some functionality may be unavailable.
                    {/* {t('app.login.options.login_session_token_body')} */}
                  </Text>
                </View>
              </PressableSettingsEntry>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: currentTheme.backgroundPrimary,
    paddingTop: rt.insets.top,
    paddingBottom: rt.insets.bottom,
  },
}));
