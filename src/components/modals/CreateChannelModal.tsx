import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {app} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {Button, Checkbox, Input, Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {commonValues} from '@clerotri/lib/themes';
import {CreateChannelModalProps} from '@clerotri/lib/types';

export const CreateChannelModal = observer(
  ({object}: {object: CreateChannelModalProps}) => {
    const {t} = useTranslation();

    const [name, setName] = useState('');
    const [type, setType] = useState('Text' as 'Text' | 'Voice');
    const [nsfw, setNSFW] = useState(false);

    return (
      <View style={localStyles.container}>
        <Text type={'h1'}>{t('app.modals.create_channel.header')}</Text>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Text type={'h2'}>{t('app.modals.create_channel.name_header')}</Text>
          <Input
            value={name}
            placeholder={t('app.modals.create_channel.name_placeholder')}
            onChangeText={v => {
              setName(v);
            }}
            style={localStyles.nameInput}
          />
          <Text type={'h2'}>{t('app.modals.create_channel.type_header')}</Text>
          <View style={localStyles.typeSelector}>
            {(['Text', 'Voice'] as const).map(ct => (
              <Pressable
                key={`channel-type-${ct}`}
                style={localStyles.channelType}
                onPress={() => {
                  setType(ct);
                }}>
                <Text style={{flex: 1}}>{ct}</Text>
                <View style={{...styles.iconContainer, marginRight: 0}}>
                  <MaterialIcon
                    name={`radio-button-${type === ct ? 'on' : 'off'}`}
                    size={28}
                    color={'accentColor'}
                  />
                </View>
              </Pressable>
            ))}
          </View>
          <View style={localStyles.checkboxRow}>
            <Text>{t('app.modals.create_channel.nsfw_label')}</Text>
            <Checkbox
              key={'checkbox-channel-nsfw'}
              value={nsfw}
              callback={() => {
                setNSFW(!nsfw);
              }}
            />
          </View>
          <Button
            onPress={() => {
              app.openCreateChannelModal(null);
              object.server.createChannel({name, type, nsfw}).then(c => {
                object.callback(c._id);
              });
            }}
            style={{marginHorizontal: 0}}>
            <Text>{t('app.actions.create_channel')}</Text>
          </Button>
          <Button
            onPress={() => {
              app.openCreateChannelModal(null);
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
  nameInput: {
    marginBlockEnd: commonValues.sizes.medium,
  },
  typeSelector: {
    marginVertical: commonValues.sizes.small,
    borderRadius: commonValues.sizes.medium,
    minWidth: '100%',
    backgroundColor: currentTheme.backgroundSecondary,
    padding: commonValues.sizes.medium,
    gap: commonValues.sizes.medium,
  },
  channelType: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: currentTheme.backgroundPrimary,
    borderRadius: commonValues.sizes.medium,
    paddingInline: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: commonValues.sizes.small,
  },
}));
