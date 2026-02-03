import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {setFunction} from '@clerotri/Generic';
import {LoadingScreen} from '@clerotri/components/views/LoadingScreen';
import {LoginPage} from '@clerotri/pages/auth/LoginPage';
import {LoginPageV2} from '@clerotri/pages/auth/LoginPageV2';
import {LoginSettingsPage} from '@clerotri/pages/auth/LoginSettingsPage';
import {Text} from '@clerotri/components/common/atoms';
import {commonValues} from '@clerotri/lib/themes';

export const LoginViews = ({markAsLoggedIn}: {markAsLoggedIn: any}) => {
  const [loginV2, setLoginV2] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    'loginSettings' | 'loginPage' | 'loadingPage'
  >('loadingPage');

  const [loadingStage, setLoadingStage] = useState<
    'connecting' | 'connected' | ''
  >('');

  setFunction('setLoggedOutScreen', (screen: 'loginPage' | 'loadingPage') => {
    setCurrentPage(screen);
  });

  setFunction('setLoadingStage', (stage: 'connecting' | 'connected' | '') => {
    setLoadingStage(stage);
  });

  return (
    <View style={{flex: 1}}>
      {loginV2 ? (
        <LoginPageV2 />
      ) : (
        <>
          {currentPage === 'loginSettings' ? (
            <LoginSettingsPage callback={() => setCurrentPage('loginPage')} />
          ) : currentPage === 'loginPage' ? (
            <LoginPage
              openLoginSettings={() => setCurrentPage('loginSettings')}
              markAsLoggedIn={markAsLoggedIn}
            />
          ) : (
            <LoadingScreen
              header={
                loadingStage === 'connected'
                  ? 'app.loading.generic'
                  : 'app.loading.connecting'
              }
            />
          )}
        </>
      )}
      {__DEV__ && (
        <Pressable
          style={localStyles.temporaryVersionSwitcher}
          onPress={() => setLoginV2(state => !state)}>
          <Text>use login v{loginV2 ? '1' : '2'}</Text>
        </Pressable>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  temporaryVersionSwitcher: {
    padding: commonValues.sizes.medium,
    paddingBlockEnd: commonValues.sizes.medium + rt.insets.bottom,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: currentTheme.backgroundSecondary,
    justifyContent: 'center',
  },
}));
