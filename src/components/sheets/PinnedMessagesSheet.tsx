import {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type {Channel, Message as RevoltMessage} from 'revolt.js';

import {Text} from '@clerotri/components/common/atoms';
import {Message} from '@clerotri/components/common/messaging';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const PinnedMessagesSheet = observer(
  ({channel}: {channel: Channel | null}) => {
    const {currentTheme} = useContext(ThemeContext);

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
                colour={currentTheme.foregroundSecondary}
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
                      style={{
                        backgroundColor: currentTheme.backgroundPrimary,
                        padding: commonValues.sizes.medium,
                        borderRadius: commonValues.sizes.medium,
                        marginBlockEnd: commonValues.sizes.xl,
                      }}>
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
