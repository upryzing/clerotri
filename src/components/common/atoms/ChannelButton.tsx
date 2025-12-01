import {useContext, useState} from 'react';
import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {Channel} from 'revolt.js';

import {MiniProfile} from '@clerotri/components/common/profile/MiniProfile';
import {ChannelIcon} from '@clerotri/components/navigation/ChannelIcon';
import {SpecialChannelIcon} from '@clerotri/components/navigation/SpecialChannelIcon';
import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms/Text';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

type ChannelButtonProps = {
  channel: Channel | 'Home' | 'Friends' | 'Saved Notes' | 'Debug';
  onPress?: any;
  onLongPress?: any;
  delayLongPress?: number;
  selected: boolean;
  showUnread?: boolean;
};

export const ChannelButton = observer(
  ({
    channel,
    onPress = () => {},
    onLongPress = () => {},
    delayLongPress,
    selected,
    showUnread = true,
  }: ChannelButtonProps) => {
    const {currentTheme} = useContext(ThemeContext);

    const [isBeingPressed, setIsBeingPressed] = useState(false);

    const color =
      selected || (showUnread && typeof channel !== 'string' && channel.unread)
        ? currentTheme.foregroundPrimary
        : currentTheme.foregroundTertiary;

    const pings = typeof channel !== 'string' ? channel.mentions?.length : 0;

    return (
      <Pressable
        onPressIn={() => setIsBeingPressed(true)}
        onPressOut={() => setIsBeingPressed(false)}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={delayLongPress}
        key={
          typeof channel !== 'string'
            ? channel._id
            : `channel-special-${channel}`
        }
        style={[
          localStyles.channelButton,
          selected && localStyles.channelButtonSelected,
          isBeingPressed && localStyles.channelButtonPressed,
        ]}>
        {typeof channel !== 'string' &&
        channel.channel_type === 'DirectMessage' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              maxWidth: '80%',
            }}>
            <MiniProfile user={channel.recipient} color={color} />
          </View>
        ) : typeof channel !== 'string' && channel.channel_type === 'Group' ? (
          <MiniProfile channel={channel} color={color} />
        ) : (
          <>
            <View style={styles.iconContainer}>
              {typeof channel !== 'string' ? (
                <ChannelIcon channel={channel} />
              ) : (
                <SpecialChannelIcon channel={channel} />
              )}
            </View>
            <Text style={{flex: 1, fontWeight: 'bold', color, fontSize: 15}}>
              {typeof channel !== 'string'
                ? (channel.name ?? `${channel}`)
                : channel}
            </Text>
            {showUnread && typeof channel !== 'string' && pings > 0 ? (
              <View style={localStyles.mentionIndicator}>
                <Text style={localStyles.mentionCount}>
                  {pings > 9 ? '9+' : pings}
                </Text>
              </View>
            ) : showUnread && typeof channel !== 'string' && channel.unread ? (
              <View style={localStyles.unreadIndicator} />
            ) : null}
          </>
        )}
      </Pressable>
    );
  },
);

const localStyles = StyleSheet.create(currentTheme => ({
  channelButton: {
    marginHorizontal: commonValues.sizes.medium,
    borderRadius: commonValues.sizes.medium,
    padding: commonValues.sizes.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelButtonPressed: {
    backgroundColor: currentTheme.hover,
  },
  channelButtonSelected: {
    backgroundColor: currentTheme.hover,
  },
  mentionIndicator: {
    width: 20,
    height: 20,
    marginHorizontal: commonValues.sizes.small,
    borderRadius: 10000,
    backgroundColor: currentTheme.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentionCount: {
    color: '#FFFFFF',
    marginRight: 1,
    marginBottom: 2,
  },
  unreadIndicator: {
    width: commonValues.sizes.large,
    height: commonValues.sizes.large,
    marginHorizontal: commonValues.sizes.medium,
    borderRadius: 10000,
    backgroundColor: currentTheme.foregroundPrimary,
  },
}));
