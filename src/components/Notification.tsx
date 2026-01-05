import {useContext} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {API, Channel} from 'revolt.js';

import {Avatar, Text, Username} from './common/atoms';
import {MaterialCommunityIcon} from '@clerotri/components/common/icons';
import {MarkdownView} from './common/MarkdownView';
import {client} from '@clerotri/lib/client';
import {ChannelContext} from '@clerotri/lib/state';
import {commonValues} from '@clerotri/lib/themes';
import {parseRevoltNodes} from '@clerotri/lib/utils';

// IDEA: make thebackground one View and then have separate Pressables for the message and close button. probably easier to dismiss that way too
export const Notification = observer(
  ({message, dismiss}: {message: API.Message; dismiss: Function}) => {
    const {setCurrentChannel} = useContext(ChannelContext);

    const openChannel = (channel: Channel | undefined) => {
      dismiss();
      setCurrentChannel(channel ?? null);
    };

    const author = client.users.get(message.author);
    const channel = client.channels.get(message.channel);

    return (
      <View style={localStyles.container}>
        <View style={localStyles.notificationBox}>
          <TouchableOpacity
            style={localStyles.notificationContent}
            onPress={() => openChannel(channel)}>
            <Avatar user={author} size={35} />
            <View
              style={{
                marginHorizontal: commonValues.sizes.medium,
                flexWrap: 'wrap',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Username user={author} server={channel?.server} />
                <Text style={{fontWeight: 'bold'}}>
                  {' '}
                  (
                  {channel?.channel_type === 'DirectMessage'
                    ? '@'
                    : channel?.channel_type === 'TextChannel'
                      ? '#'
                      : ''}
                  {channel?.name ?? channel?._id})
                </Text>
              </View>
              {message.content ? (
                <MarkdownView>
                  {parseRevoltNodes(
                    message.content.length > 200
                      ? message.content.slice(0, 200) + '...'
                      : message.content,
                  )}
                </MarkdownView>
              ) : (
                <Text useNewText colour={'foregroundSecondary'}>
                  Tap to view message
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <Pressable
            style={{
              width: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => dismiss()}>
            <MaterialCommunityIcon name="close-circle" size={20} />
          </Pressable>
        </View>
      </View>
    );
  },
);

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  container: {
    position: 'absolute',
    top: rt.insets.top,
    left: 0,
    width: '100%',
    padding: commonValues.sizes.xl,
  },
  notificationBox: {
    flex: 1,
    backgroundColor: currentTheme.background,
    borderRadius: commonValues.sizes.medium,
    minHeight: 40,
    padding: commonValues.sizes.large,
    boxShadow: [
      {
        color: '#00000080',
        blurRadius: commonValues.sizes.large,
        offsetX: 0,
        offsetY: 0,
      },
    ],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationContent: {
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
}));
