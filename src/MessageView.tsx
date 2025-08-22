import {useContext, useEffect, useRef, useState} from 'react';
import type {Dispatch, SetStateAction} from 'react';
import {
  Platform,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import { LegendList } from '@legendapp/list';
import {ErrorBoundary} from 'react-error-boundary';

import {Channel, Message as RevoltMessage} from 'revolt.js';

import {app, settings} from './Generic';
import {client} from './lib/client';
import {MessageBox} from './components/MessageBox';
import {styles} from './Theme';
import {Button, Text} from './components/common/atoms';
import {Message} from './components/common/messaging';
import {LoadingScreen} from './components/views/LoadingScreen';
import {ThemeContext} from './lib/themes';
import {calculateGrouped, fetchMessages} from './lib/utils';

type DoubleTapState = {
  count: number;
  message: string;
};

function renderMessage(
  msg: RevoltMessage,
  onPress: (m: RevoltMessage) => void,
  messages?: RevoltMessage[],
) {
  let grouped = false;
  let groupedAfter = false;
  if (messages) {
    try {
      const index = messages.indexOf(msg);
      if (index > 0) {
        grouped = calculateGrouped(msg, messages[index - 1]);
      }
      if (index < messages.length) {
        groupedAfter = calculateGrouped(messages[index + 1], msg);
      }
    } catch (err) {
      console.log(
        `[NEWMESSAGEVIEW] Error calculating grouped status for ${msg._id}: ${err}`,
      );
    }
  }
  return (
    <Message
      key={`message-${msg._id}`}
      message={msg}
      grouped={grouped}
      groupedAfter={groupedAfter}
      onPress={() => onPress(msg)}
      onUserPress={() => app.openProfile(msg.author, msg.channel?.server)}
      onUsernamePress={() => {
        const currentText = app.getMessageBoxInput();
        app.setMessageBoxInput(
          `${currentText}${currentText.length > 0 ? ' ' : ''}<@${
            msg.author?._id
          }>`,
        );
      }}
      onLongPress={() => app.openMessage(msg)}
    />
  );
}

let doubleTapStatus: DoubleTapState = {
  count: 0,
  message: '',
};

function handleTap(message: RevoltMessage) {
  if (message._id === doubleTapStatus.message) {
    if (doubleTapStatus.count === 1) {
      if (settings.get('ui.messaging.doubleTapToReply')) {
        const existingReplies = [...app.getReplyingMessages()];
        if (
          existingReplies.filter(m => m.message._id === message._id).length > 0
        ) {
          doubleTapStatus = {count: 0, message: ''};
          return;
        }
        if (existingReplies.length >= 5) {
          doubleTapStatus = {count: 0, message: ''};
          return;
        }
        app.setReplyingMessages([
          ...existingReplies,
          {message: message, mentions: false},
        ]);
      }
      doubleTapStatus = {count: 0, message: ''};
    }
  } else {
    doubleTapStatus = {count: 1, message: message._id};
  }
}

function MessageViewErrorMessage({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: () => void;
}) {
  const {currentTheme} = useContext(ThemeContext);

  const errorMessage = `${error}`;

  console.error(`[MESSAGEVIEW] Uncaught error: ${errorMessage}`);
  return (
    <>
      <Text colour={currentTheme.error}>
        Error rendering messages: {errorMessage}
      </Text>
      <Button
        onPress={() => {
          resetErrorBoundary();
        }}>
        <Text>Retry</Text>
      </Button>
    </>
  );
}

const NewMessageView = observer(
  ({
    channel,
    messages,
    fetchMoreMessages,
  }: {
    channel: Channel;
    messages: RevoltMessage[];
    fetchMoreMessages: (before: string) => void;
  }) => {
    console.log(`[NEWMESSAGEVIEW] Creating message view for ${channel._id}...`);

    const {t} = useTranslation();

    // set functions here so they don't get recreated
    const onPress = (m: RevoltMessage) => {
      handleTap(m);
    };

    const renderItem = ({item}: {item: RevoltMessage}) => {
      return renderMessage(item, onPress, messages);
    };

    const keyExtractor = (item: RevoltMessage) => {
      return `message-${item._id}`;
    };

    return (
      <ErrorBoundary FallbackComponent={MessageViewErrorMessage}>
        <View key={'messageview-outer-container'} style={{flex: 1}}>
          <LegendList
            key={'messageview-scrollview'}
            keyExtractor={keyExtractor}
            data={messages}
            style={styles.messagesView}
            contentContainerStyle={{
              paddingBottom: Platform.OS === 'web' ? 0 : 20,
              flexGrow: 1,
              justifyContent: 'flex-end',
              flexDirection: 'column',
            }}
            // ref={scrollViewRef}
            renderItem={renderItem}
            initialScrollIndex={messages.length - 1}
            waitForInitialLayout
            alignItemsAtEnd
            maintainScrollAtEnd
            maintainScrollAtEndThreshold={0.2}
            maintainVisibleContentPosition
            onStartReached={() => {console.log('owo'); fetchMoreMessages(messages[0]._id);}}
            onEndReached={() => {console.log('hii'); channel.ack(channel.last_message_id ?? '01ANOMESSAGES', true);}}
          />
          {messages.length === 0 && (
            <View style={{padding: 16}}>
              <Text type={'h1'}>{t('app.messaging.no_messages')}</Text>
              <Text>{t('app.messaging.no_messages_body')}</Text>
            </View>
          )}
        </View>
        <MessageBox channel={channel} />
      </ErrorBoundary>
    );
  },
);

function handleNewMessage(
  channel: Channel,
  handledMessages: string[],
  setMessages: Dispatch<SetStateAction<RevoltMessage[]>>,
  setError: (error: any) => void,
  msg: RevoltMessage,
) {
  console.log(`[NEWMESSAGEVIEW] Handling new message ${msg._id}`);

  if (msg.channel !== channel || handledMessages.includes(msg._id)) {
    return;
  }

  // set this before anything happens that might change it
  try {
    handledMessages.push(msg._id);
    console.log(
      `[NEWMESSAGEVIEW] New message ${msg._id} is in current channel; pushing it to the message list...`,
    );
    setMessages(oldMessages => [...oldMessages, msg]);
  } catch (err) {
    console.log(
      `[NEWMESSAGEVIEW] Error pushing new message (${msg._id}): ${err}`,
    );
    setError(err);
  }
}

function handleMessageDeletion(
  channel: Channel,
  setMessages: Dispatch<SetStateAction<RevoltMessage[]>>,
  id: string,
  msg?: RevoltMessage,
) {
  if (msg?.channel?._id === channel._id) {
    setMessages(oldMessages => oldMessages.filter(m => m._id !== id));
  }
}

export const MessageView = observer(({channel}: {channel: Channel}) => {
  const {currentTheme} = useContext(ThemeContext);

  const handledMessages = useRef<string[]>([]);

  const [messages, setMessages] = useState<RevoltMessage[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as any);

  function fetchMoreMessages(messageID: string) {
    fetchMessages(
      channel,
      {
        type: 'before',
        id: messageID,
      },
      messages,
    ).then(newMsgs => {
      setMessages(newMsgs);
    });
  }

  useEffect(() => {
    console.log(`[NEWMESSAGEVIEW] Fetching messages for ${channel._id}...`);
    async function getMessages() {
      const msgs = await fetchMessages(channel, {}, []);
      console.log(
        `[NEWMESSAGEVIEW] Pushing ${msgs.length} initial message(s) for ${channel._id}...`,
      );
      setMessages(msgs);
      setLoading(false);
    }

    function cleanupMessages() {
      setLoading(true);
      setMessages([]);
    }

    try {
      getMessages();
    } catch (err) {
      console.log(
        `[NEWMESSAGEVIEW] Error fetching initial messages for ${channel._id}: ${err}`,
      );
      setError(err);
    }

    // called when switching channels
    return () => cleanupMessages();
  }, [channel]);

  useEffect(() => {
    console.log(`[NEWMESSAGEVIEW] Setting up listeners for ${channel._id}...`);

    function onNewMessage(msg: RevoltMessage) {
      handleNewMessage(
        channel,
        handledMessages.current,
        setMessages,
        setError,
        msg,
      );
    }

    function onMessageDeletion(id: string, msg?: RevoltMessage) {
      handleMessageDeletion(channel, setMessages, id, msg);
    }

    function setUpListeners() {
      client.addListener('message', onNewMessage);
      client.addListener('message/delete', onMessageDeletion);
    }

    function cleanupListeners() {
      client.removeListener('message', onNewMessage);
      client.removeListener('message/delete', onMessageDeletion);
    }

    try {
      setUpListeners();
    } catch (err) {
      console.log(
        `[NEWMESSAGEVIEW] Error setting up listeners for ${channel._id}: ${err}`,
      );
      setError(err);
    }

    // called when switching channels
    return () => cleanupListeners();
  }, [channel]);

  return (
    <ErrorBoundary FallbackComponent={MessageViewErrorMessage}>
      {error ? (
        <Text colour={currentTheme.error}>
          Error rendering messages: {error.message ?? error}
        </Text>
      ) : loading ? (
        <LoadingScreen />
      ) : (
        <NewMessageView
          channel={channel}
          messages={messages}
          fetchMoreMessages={fetchMoreMessages}
        />
      )}
    </ErrorBoundary>
  );
});
