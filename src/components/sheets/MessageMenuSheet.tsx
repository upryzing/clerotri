import {useContext} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import type {Message} from 'revolt.js';

import {app, settings} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {
  ContextButton,
  CopyIDButton,
  Text,
} from '@clerotri/components/common/atoms';
import {ReplyMessage} from '@clerotri/components/common/messaging/ReplyMessage';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const MessageMenuSheet = observer(
  ({message}: {message: Message | null}) => {
    const {currentTheme} = useContext(ThemeContext);

    return (
      <View style={{paddingHorizontal: 16}}>
        {!message ? (
          <></>
        ) : (
          <>
            <View
              style={{
                paddingBottom: commonValues.sizes.large,
                overflow: 'hidden',
              }}>
              <ReplyMessage message={message} showSymbol={false} />
            </View>
            {message.channel?.havePermission('SendMessage') ? (
              <ContextButton
                onPress={() => {
                  let replyingMessages = [...app.getReplyingMessages()];
                  if (
                    replyingMessages.filter(m => m.message._id === message._id)
                      .length > 0
                  ) {
                    return;
                  }
                  if (replyingMessages.length >= 5) {
                    return;
                  }
                  if (app.getEditingMessage()) {
                    return;
                  }
                  replyingMessages.push({
                    message: message,
                    mentions: false,
                  });
                  app.setReplyingMessages(replyingMessages);
                  app.openMessage(null);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name="reply"
                    size={20}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
                <Text>Reply</Text>
              </ContextButton>
            ) : null}
            {message.content ? (
              <ContextButton
                onPress={() => {
                  Clipboard.setString(message.content!);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name="content-copy"
                    size={20}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
                <Text>Copy content</Text>
              </ContextButton>
            ) : null}
            {settings.get('ui.showDeveloperFeatures') ? (
              <CopyIDButton id={message._id} />
            ) : null}
            <ContextButton
              onPress={() => {
                Clipboard.setString(message.url);
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name="link"
                  size={20}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
              <Text>Copy message link</Text>
            </ContextButton>
            {message.author?.relationship === 'User' ? (
              <ContextButton
                onPress={() => {
                  app.setMessageBoxInput(message.content);
                  app.setEditingMessage(message);
                  app.setReplyingMessages([]);
                  app.openMessage(null);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name="edit"
                    size={20}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
                <Text>Edit</Text>
              </ContextButton>
            ) : null}
            {message.channel?.havePermission('ManageMessages') ? (
              <ContextButton
                onPress={() => {
                  message.pinned ? message.unpin() : message.pin();
                  app.openMessage(null);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcon
                    name={message.pinned ? 'pin-off' : 'pin'}
                    size={20}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
                <Text>{message.pinned ? 'Unpin' : 'Pin'}</Text>
              </ContextButton>
            ) : null}
            {message.channel?.havePermission('ManageMessages') ||
            message.author?.relationship === 'User' ? (
              <ContextButton
                onPress={() => {
                  app.openDeletionConfirmationModal({
                    type: 'Message',
                    object: message,
                  });
                  app.openMessage(null);
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name="delete"
                    size={20}
                    color={currentTheme.error}
                  />
                </View>
                <Text colour={currentTheme.error}>Delete</Text>
              </ContextButton>
            ) : null}
            {message.author?.relationship !== 'User' ? (
              <ContextButton
                onPress={() => {
                  app.openReportMenu({object: message, type: 'Message'});
                }}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name="flag"
                    size={20}
                    color={currentTheme.error}
                  />
                </View>
                <Text colour={currentTheme.error}>Report Message</Text>
              </ContextButton>
            ) : null}
            <View style={{marginTop: 20}} />
          </>
        )}
      </View>
    );
  },
);
