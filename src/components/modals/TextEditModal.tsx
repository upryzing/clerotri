import {useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {app} from '@clerotri/Generic';
import {Button, Input, Text} from '@clerotri/components/common/atoms';
import {commonValues} from '@clerotri/lib/themes';
import {TextEditingModalProps} from '@clerotri/lib/types';

export const TextEditModal = ({object}: {object: TextEditingModalProps}) => {
  const {t} = useTranslation();

  const [string, setString] = useState(object.initialString);
  return (
    <View style={localStyles.container}>
      <Text type={'h1'}>{t(`app.modals.edit_text.${object.id}_header`)}</Text>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: 10,
        }}>
        <Input
          value={string}
          placeholder={t(`app.modals.edit_text.${object.id}_placeholder`)}
          onChangeText={v => {
            setString(v);
          }}
        />
        <Button
          onPress={() => {
            app.openTextEditModal(null);
            object.callback(string);
          }}
          style={{
            marginBlockStart: commonValues.sizes.xl,
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
      </View>
    </View>
  );
};

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
