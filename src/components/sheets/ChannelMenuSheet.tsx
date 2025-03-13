import {useContext, useRef, useState} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type BottomSheetCore from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import type {Channel} from 'revolt.js';

import {app, setFunction, settings} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {
  ContextButton,
  CopyIDButton,
  Text,
} from '@clerotri/components/common/atoms';
import {BottomSheet} from '@clerotri/components/common/BottomSheet';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {useBackHandler} from '@clerotri/lib/ui';

export const ChannelMenuSheet = observer(() => {
  const {currentTheme} = useContext(ThemeContext);

  const [channel, setChannel] = useState(null as Channel | null);

  const sheetRef = useRef<BottomSheetCore>(null);

  useBackHandler(() => {
    if (channel) {
      sheetRef.current?.close();
      return true;
    }

    return false;
  });

  setFunction('openChannelContextMenu', async (c: Channel | null) => {
    setChannel(c);
    c ? sheetRef.current?.expand() : sheetRef.current?.close();
  });

  return (
    <BottomSheet sheetRef={sheetRef}>
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
              <ContextButton
                onPress={async () => {
                  const invite = await channel.createInvite();
                  app.openNewInviteModal(invite._id);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name="person-add"
                    size={20}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
                <Text>Create invite</Text>
              </ContextButton>
            ) : null}
            <ContextButton
              onPress={() => {
                channel.ack(channel.last_message_id ?? '01ANOMESSAGES', true);
                app.openChannelContextMenu(null);
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name="visibility"
                  size={20}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
              <Text>Mark as read</Text>
            </ContextButton>
            {settings.get('ui.showDeveloperFeatures') ? (
              <CopyIDButton id={channel._id} />
            ) : null}
            <ContextButton
              onPress={() => {
                Clipboard.setString(channel.url);
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name="link"
                  size={20}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
              <Text>Copy channel link</Text>
            </ContextButton>
            {channel?.havePermission('ManageChannel') ? (
              <ContextButton
                onPress={() => {
                  app.openDeletionConfirmationModal({
                    type: 'Channel',
                    object: channel,
                  });
                  app.openChannelContextMenu(null);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name="delete"
                    size={20}
                    color={currentTheme.error}
                  />
                </View>
                <Text colour={currentTheme.error}>Delete channel</Text>
              </ContextButton>
            ) : null}
            <View style={{marginTop: 20}} />
          </>
        )}
      </View>
    </BottomSheet>
  );
});
