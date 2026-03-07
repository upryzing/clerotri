import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {app} from '@clerotri/Generic';
import {Button, Text} from '@clerotri/components/common/atoms';
import {ModalContainer} from '@clerotri/components/modals/common';
import {client} from '@clerotri/lib/client';
import Clipboard from '@react-native-clipboard/clipboard';

export const NewInviteModal = observer(({code}: {code: string}) => {
  const {t} = useTranslation();

  const link = `${client.configuration?.app}/invite/`;

  const fullInvite = `${link}${code}`;

  return (
    <ModalContainer>
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
    </ModalContainer>
  );
});
