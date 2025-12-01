import {useContext, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {Trans, useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Button, Input, Text} from '@clerotri/components/common/atoms';
import {GapView} from '@clerotri/components/layout';
import {app} from '@clerotri/Generic';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {MemberWithModAction} from '@clerotri/lib/types';

export const ConfirmModActionModal = observer(
  ({target}: {target: MemberWithModAction}) => {
    const {currentTheme} = useContext(ThemeContext);

    const [reason, setReason] = useState('');

    const {t} = useTranslation();
    const name =
      target.member.nickname ??
      target.member.user?.display_name ??
      target.member.user?.username;

    return (
      <View style={localStyles.container}>
        <Text type={'h1'}>
          {t(`app.modals.confirm_mod_action.header_${target.action}`)}
        </Text>
        <Trans
          t={t}
          i18nKey={`app.modals.confirm_mod_action.body_${target.action}`}>
          Are you sure you want to{' '}
          <Text style={{fontWeight: 'bold'}}>ACTION</Text>{' '}
          <Text
            style={{
              fontWeight: 'bold',
              color: target.member.roleColour ?? currentTheme.foregroundPrimary,
            }}>
            {
              // @ts-expect-error this is an i18next placeholder
              {name}
            }
          </Text>
          ?
        </Trans>
        <GapView size={4} />
        <Text type={'h2'}>
          {t(`app.modals.confirm_mod_action.reason_${target.action}`)}
        </Text>
        <Input
          placeholderTextColor={currentTheme.foregroundSecondary}
          placeholder={t('app.modals.confirm_mod_action.reason_placeholder')}
          onChangeText={v => setReason(v)}
          value={reason}
        />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Button
            onPress={() => target.callback(reason)}
            backgroundColor={currentTheme.error}
            style={{marginHorizontal: 0}}>
            <Text>{t(`app.actions.${target.action}`)}</Text>
          </Button>
          <Button
            onPress={() => {
              app.openModActionModal(null);
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
