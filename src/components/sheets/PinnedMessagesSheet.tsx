import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {Channel, Message as RevoltMessage} from 'revolt.js';

import {Text} from '@clerotri/components/common/atoms';
import {Message} from '@clerotri/components/common/messaging';
import {commonValues} from '@clerotri/lib/themes';

export const PinnedMessagesSheet = observer(
  ({channel}: {channel: Channel | null}) => {
    const [pinnedMessages, setPinnedMessages] = useState([] as RevoltMessage[]);

    useEffect(() => {
      async function fetchMessages() {
        if (!channel) {
          return;
        }
        const m = await channel.search({pinned: true});
        setPinnedMessages(m);
      }
      fetchMessages();
    }, [channel]);

    return (
      <View style={{paddingHorizontal: commonValues.sizes.xl}}>
        {!channel ? (
          <></>
        ) : (
          <>
            <View style={{justifyContent: 'center'}}>
              <Text type={'h1'}>Pinned messages</Text>
              <Text
                useNewText
                colour={'foregroundSecondary'}
                style={{
                  marginVertical: commonValues.sizes.small,
                }}>
                {`${pinnedMessages.length} ${
                  pinnedMessages.length === 1
                    ? 'pinned message'
                    : 'pinned messages'
                }`}
              </Text>
              {pinnedMessages.length > 0 &&
                pinnedMessages.map(message => {
                  return (
                    <View
                      key={message._id}
                      style={localStyles.messageContainer}>
                      <Message
                        key={message._id}
                        message={message}
                        grouped={false}
                        noTopMargin={true}
                      />
                    </View>
                  );
                })}
            </View>
          </>
        )}
      </View>
    );
  },
);

const localStyles = StyleSheet.create(currentTheme => ({
  messageContainer: {
    backgroundColor: currentTheme.backgroundPrimary,
    padding: commonValues.sizes.medium,
    borderRadius: commonValues.sizes.medium,
    marginBlockEnd: commonValues.sizes.xl,
  },
}));
