import {Fragment, useState} from 'react';
import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {app} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {Button, Checkbox, Input, Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {LineSeparator} from '@clerotri/components/layout';
import {ModalContainer} from '@clerotri/components/modals/common';
import {commonValues} from '@clerotri/lib/themes';
import type {CreateChannelModalProps} from '@clerotri/lib/types';

export const CreateChannelModal = observer(
  ({object}: {object: CreateChannelModalProps}) => {
    const {t} = useTranslation();

    const [name, setName] = useState('');
    const [type, setType] = useState('Text' as 'Text' | 'Voice');
    const [nsfw, setNSFW] = useState(false);

    const ChannelTypes = ['Text', 'Voice'] as const;

    return (
      <ModalContainer>
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
            {ChannelTypes.map((ct, i) => (
              <Fragment key={`channel-type-${ct}`}>
                <Pressable
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
                {i !== ChannelTypes.length - 1 && <LineSeparator />}
              </Fragment>
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
            style={{marginHorizontal: 0, marginBlockStart: 0}}>
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
      </ModalContainer>
    );
  },
);

const localStyles = StyleSheet.create(currentTheme => ({
  nameInput: {
    marginBlockEnd: commonValues.sizes.medium,
  },
  typeSelector: {
    borderRadius: commonValues.sizes.medium,
    minWidth: '100%',
    backgroundColor: currentTheme.backgroundSecondary,
    paddingInline: commonValues.sizes.large,
    paddingBlock: commonValues.sizes.xs,
  },
  channelType: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBlock: commonValues.sizes.medium,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: commonValues.sizes.large,
  },
}));
