import {useContext, useState} from 'react';
import {View} from 'react-native';

import {setFunction} from '@clerotri/Generic';
import {LoadingScreen} from '@clerotri/components/views/LoadingScreen';
import {LoginPage} from '@clerotri/pages/auth/LoginPage';
import {LoginSettingsPage} from '@clerotri/pages/auth/LoginSettingsPage';
import {ThemeContext} from '@clerotri/lib/themes';

export const LoginViews = ({markAsLoggedIn}: {markAsLoggedIn: any}) => {
  const {currentTheme} = useContext(ThemeContext);

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
    <View style={{flex: 1, backgroundColor: currentTheme.backgroundPrimary}}>
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
    </View>
  );
};
