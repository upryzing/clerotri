import {useContext, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {app} from '@clerotri/Generic';
import {Button, Text} from '@clerotri/components/common/atoms';
import {client} from '@clerotri/lib/client';
import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';
import Clipboard from '@react-native-clipboard/clipboard';

export const NewInviteModal = observer(({code}: {code: string}) => {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = useMemo(
    () => generateLocalStyles(currentTheme),
    [currentTheme],
  );

  const {t} = useTranslation();

  const link = `${client.configuration?.app}/invite/`;

  const fullInvite = `${link}${code}`;

  return (
    <View style={localStyles.container}>
      <Text type={'h1'}>{t('app.modals.new_invite.header')}</Text>
      <Text>{t('app.modals.new_invite.body')}</Text>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Text
          font={'JetBrains Mono'}
          style={{marginBlock: 10, textAlign: 'center'}}>
          {link}
          {'\n'}
          <Text
            font={'JetBrains Mono'}
            style={{fontWeight: 'bold', fontSize: 18}}>
            {code}
          </Text>
        </Text>
        <Button
          onPress={() => {
            Clipboard.setString(fullInvite);
          }}
          style={{marginHorizontal: 0}}>
          <Text>{t('app.actions.copy_invite')}</Text>
        </Button>
        <Button
          onPress={() => {
            app.openNewInviteModal(null);
          }}
          style={{marginHorizontal: 0}}>
          <Text>{t('app.actions.close')}</Text>
        </Button>
      </View>
    </View>
  );
});

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    container: {
      width: '80%',
      borderRadius: commonValues.sizes.medium,
      padding: 20,
      backgroundColor: currentTheme.backgroundPrimary,
      justifyContent: 'center',
      alignSelf: 'center',
    },
    typeSelector: {
      marginVertical: commonValues.sizes.small,
      borderRadius: commonValues.sizes.medium,
      minWidth: '100%',
      backgroundColor: currentTheme.backgroundSecondary,
      padding: commonValues.sizes.medium,
    },
    channelType: {
      height: 40,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: currentTheme.backgroundPrimary,
      borderRadius: commonValues.sizes.medium,
      paddingLeft: 10,
      paddingRight: 10,
      marginVertical: commonValues.sizes.small,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: commonValues.sizes.small,
    },
  });
};
