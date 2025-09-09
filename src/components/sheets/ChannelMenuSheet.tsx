import {useContext} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';

import type {Channel} from 'revolt.js';

import {app, settings} from '@clerotri/Generic';
import {Text} from '@clerotri/components/common/atoms';
import {
  CopyIDButton,
  NewContextButton,
} from '@clerotri/components/common/buttons';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const ChannelMenuSheet = observer(
  ({channel}: {channel: Channel | null}) => {
    const {currentTheme} = useContext(ThemeContext);

    return (
      <View style={{paddingHorizontal: 16}}>
        {!channel ? (
          <></>
        ) : (
          <>
            <View
              style={{
                paddingBottom: commonValues.sizes.large,
                overflow: 'hidden',
              }}>
              <Text type={'h1'}>{channel.name}</Text>
            </View>
            {channel?.havePermission('InviteOthers') ? (
              <NewContextButton
                type={'detatched'}
                icon={{pack: 'regular', name: 'person-add'}}
                textString={'Create invite'}
                onPress={async () => {
                  const invite = await channel.createInvite();
                  app.openNewInviteModal(invite._id);
                }}
              />
            ) : null}
            <NewContextButton
              type={'detatched'}
              icon={{pack: 'regular', name: 'visibility'}}
              textString={'Mark as read'}
              onPress={() => {
                channel.ack(channel.last_message_id ?? '01ANOMESSAGES', true);
                app.openChannelContextMenu(null);
              }}
            />
            {settings.get('ui.showDeveloperFeatures') ? (
              <CopyIDButton type={'start'} itemID={channel._id} />
            ) : null}
            <NewContextButton
              type={
                settings.get('ui.showDeveloperFeatures') ? 'end' : 'detatched'
              }
              icon={{pack: 'regular', name: 'link'}}
              textString={'Copy channel link'}
              onPress={() => {
                Clipboard.setString(channel.url);
              }}
            />
            {channel?.havePermission('ManageChannel') ? (
              <NewContextButton
                type={'detatched'}
                icon={{
                  pack: 'regular',
                  name: 'delete',
                  colour: currentTheme.error,
                }}
                textString={'Delete channel'}
                textColour={currentTheme.error}
                onPress={() => {
                  app.openDeletionConfirmationModal({
                    type: 'Channel',
                    object: channel,
                  });
                  app.openChannelContextMenu(null);
                }}
              />
            ) : null}
          </>
        )}
      </View>
    );
  },
);
