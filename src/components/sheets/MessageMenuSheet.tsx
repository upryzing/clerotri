import {useContext} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';

import type {Message} from 'revolt.js';

import {app, settings} from '@clerotri/Generic';
import {
  CopyIDButton,
  NewContextButton,
} from '@clerotri/components/common/buttons';
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
              <NewContextButton
                type={'detatched'}
                icon={{pack: 'regular', name: 'reply'}}
                textString={'Reply'}
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
                }}
              />
            ) : null}
            {message.content !== null ? (
              <NewContextButton
                type={'start'}
                icon={{pack: 'regular', name: 'content-copy'}}
                textString={'Copy content'}
                onPress={() => {
                  Clipboard.setString(message.content!);
                }}
              />
            ) : null}
            {settings.get('ui.showDeveloperFeatures') ? (
              <CopyIDButton
                type={message.content === null ? 'start' : undefined}
                itemID={message._id}
              />
            ) : null}
            <NewContextButton
              type={'end'}
              icon={{pack: 'regular', name: 'link'}}
              textString={'Copy message link'}
              onPress={() => {
                Clipboard.setString(message.url);
              }}
            />
            {message.author?.relationship === 'User' ? (
              <NewContextButton
                type={
                  message.channel?.havePermission('ManageMessages')
                    ? 'start'
                    : 'detatched'
                }
                icon={{pack: 'regular', name: 'edit'}}
                textString={'Edit'}
                onPress={() => {
                  app.setMessageBoxInput(message.content);
                  app.setEditingMessage(message);
                  app.setReplyingMessages([]);
                  app.openMessage(null);
                }}
              />
            ) : null}
            {message.channel?.havePermission('ManageMessages') ? (
              <NewContextButton
                type={
                  message.author?.relationship === 'User' ? 'end' : 'detatched'
                }
                icon={{
                  pack: 'community',
                  name: message.pinned ? 'pin-off' : 'pin',
                }}
                textString={message.pinned ? 'Unpin' : 'Pin'}
                onPress={() => {
                  message.pinned ? message.unpin() : message.pin();
                  app.openMessage(null);
                }}
              />
            ) : null}
            {message.channel?.havePermission('ManageMessages') ||
            message.author?.relationship === 'User' ? (
              <NewContextButton
                type={
                  message.author?.relationship !== 'User'
                    ? 'start'
                    : 'detatched'
                }
                icon={{
                  pack: 'regular',
                  name: 'delete',
                  colour: currentTheme.error,
                }}
                textString={'Delete'}
                textColour={currentTheme.error}
                onPress={() => {
                  app.openDeletionConfirmationModal({
                    type: 'Message',
                    object: message,
                  });
                  app.openMessage(null);
                }}
              />
            ) : null}
            {message.author?.relationship !== 'User' ? (
              <NewContextButton
                type={
                  message.channel?.havePermission('ManageMessages')
                    ? 'end'
                    : 'detatched'
                }
                icon={{
                  pack: 'regular',
                  name: 'flag',
                  colour: currentTheme.error,
                }}
                textString={'Report message'}
                textColour={currentTheme.error}
                onPress={() => {
                  app.openReportMenu({object: message, type: 'Message'});
                }}
              />
            ) : null}
            <View style={{marginTop: 20}} />
          </>
        )}
      </View>
    );
  },
);
