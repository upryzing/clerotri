import {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Button, Input, Text} from '@clerotri/components/common/atoms';
import {ModalContainer} from '@clerotri/components/modals/common';
import {app} from '@clerotri/Generic';
import {commonValues} from '@clerotri/lib/themes';
import type {TextEditingModalProps} from '@clerotri/lib/types';

export const TextEditModal = ({object}: {object: TextEditingModalProps}) => {
  const {t} = useTranslation();

  const [string, setString] = useState(object.initialString);
  return (
    <ModalContainer>
      <Text type={'h1'}>{t(`app.modals.edit_text.${object.id}_header`)}</Text>

      <Input
        value={string}
        placeholder={t(`app.modals.edit_text.${object.id}_placeholder`)}
        onChangeText={v => {
          setString(v);
        }}
        style={{marginBlock: commonValues.sizes.large}}
      />
      <Button
        onPress={() => {
          app.openTextEditModal(null);
          object.callback(string);
        }}
        style={{
          marginHorizontal: 0,
        }}>
        <Text>{t('app.actions.confirm')}</Text>
      </Button>
      <Button
        onPress={() => {
          app.openTextEditModal(null);
        }}
        style={{marginHorizontal: 0}}>
        <Text>{t('app.actions.cancel')}</Text>
      </Button>
    </ModalContainer>
  );
};
