import {useContext} from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {Trans, useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {app} from '@clerotri/Generic';
import {ChannelContext} from '@clerotri/lib/state';
import {commonValues} from '@clerotri/lib/themes';
import {DeletableObject} from '@clerotri/lib/types';
import {Button, Text} from '@clerotri/components/common/atoms';

export const ConfirmDeletionModal = observer(
  ({target}: {target: DeletableObject}) => {
    const {currentChannel, setCurrentChannel} = useContext(ChannelContext);

    const {t} = useTranslation();
    const name = target.type === 'Server' ? target.object.name : '';
    return (
      <View style={localStyles.container}>
        <Text type={'h1'}>
          {t(`app.modals.confirm_deletion.header_${target.type.toLowerCase()}`)}
        </Text>
        {target.type === 'Server' ? (
          <Trans t={t} i18nKey={'app.modals.confirm_deletion.body_server'}>
            Are you sure you want to delete{' '}
            <Text style={{fontWeight: 'bold'}}>
              {
                // @ts-expect-error this is an i18next placeholder
                {name}
              }
            </Text>
            ?
          </Trans>
        ) : (
          <Trans
            t={t}
            i18nKey={`app.modals.confirm_deletion.body_${target.type.toLowerCase()}`}>
            Are you sure you want to delete{' '}
            <Text style={{fontWeight: 'bold'}}>
              this {target.type.toLowerCase()}
            </Text>
            ?
          </Trans>
        )}
        <Text style={{fontWeight: 'bold'}}>
          {t('app.modals.confirm_deletion.warning')}
        </Text>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Button
            onPress={() => {
              switch (target.type) {
                case 'Role':
                  app.closeRoleSubsection();
                  target.object.server.deleteRole(target.object.role);
                  app.openDeletionConfirmationModal(null);
                  break;
                case 'Server':
                  app.openServerContextMenu(null);
                  app.openServer(undefined);
                  app.openServerSettings(null);
                  if (
                    typeof currentChannel !== 'string' &&
                    currentChannel?.server?._id === target.object._id
                  ) {
                    setCurrentChannel(null);
                  }
                  target.object.delete();
                  app.openDeletionConfirmationModal(null);
                  break;
                case 'Message':
                  target.object.delete();
                  app.openDeletionConfirmationModal(null);
                  break;
                default:
                  break;
              }
            }}
            style={{marginHorizontal: 0}}>
            <Text useNewText colour={'error'} style={{fontWeight: 'bold'}}>
              {t('app.actions.delete')}
            </Text>
          </Button>
          <Button
            onPress={() => {
              app.openDeletionConfirmationModal(null);
            }}
            style={{marginHorizontal: 0}}>
            <Text>{t('app.actions.cancel')}</Text>
          </Button>
        </View>
      </View>
    );
  },
);

const localStyles = StyleSheet.create(currentTheme => ({
  container: {
    width: '80%',
    borderRadius: commonValues.sizes.medium,
    padding: 20,
    backgroundColor: currentTheme.backgroundPrimary,
    justifyContent: 'center',
    alignSelf: 'center',
  },
}));
