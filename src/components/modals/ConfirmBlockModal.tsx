import {View} from 'react-native';
import {Trans, useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Button, Text} from '@clerotri/components/common/atoms';
import {GapView} from '@clerotri/components/layout';
import {ModalContainer} from '@clerotri/components/modals/common';
import {app} from '@clerotri/Generic';
import {commonValues} from '@clerotri/lib/themes';
import type {UserWithBlockAction} from '@clerotri/lib/types';

export const ConfirmBlockModal = observer(
  ({target}: {target: UserWithBlockAction}) => {
    const {t} = useTranslation();
    const name = target.user.display_name ?? target.user.username;

    return (
      <ModalContainer>
        <Text type={'h1'}>
          {t(
            `app.modals.confirm_block.header${target.unblock ? '_unblock' : ''}`,
          )}
        </Text>
        <Trans
          t={t}
          i18nKey={`app.modals.confirm_block.body${target.unblock ? '_unblock' : ''}`}>
          Are you sure you want to{' '}
          <Text style={{fontWeight: 'bold'}}>ACTION</Text>{' '}
          <Text
            style={{
              fontWeight: 'bold',
            }}>
            {
              // @ts-expect-error this is an i18next placeholder
              {name}
            }
          </Text>
          ?
        </Trans>
        <GapView size={6} />
        <Text useNewText colour={'foregroundSecondary'}>
          {t(
            `app.modals.confirm_block.notice${target.unblock ? '_unblock' : ''}`,
          )}
        </Text>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginBlockStart: commonValues.sizes.large,
          }}>
          <Button
            onPress={() => target.callback()}
            style={{marginHorizontal: 0}}>
            <Text useNewText colour={'error'} style={{fontWeight: 'bold'}}>
              {t(`app.actions.${target.unblock ? 'un' : ''}block`)}
            </Text>
          </Button>
          <Button
            onPress={() => {
              app.openBlockConfirmationModal(null);
            }}
            style={{marginHorizontal: 0}}>
            <Text>{t('app.actions.cancel')}</Text>
          </Button>
        </View>
      </ModalContainer>
    );
  },
);
