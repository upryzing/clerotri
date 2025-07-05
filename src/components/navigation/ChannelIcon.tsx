import {useContext} from 'react';

import MaterialIcon from '@react-native-vector-icons/material-icons';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';

import type {Channel} from 'revolt.js';

import {Image} from '@clerotri/crossplat/Image';
import {ThemeContext} from '@clerotri/lib/themes';

export const ChannelIcon = ({
  channel,
  showUnread = true,
}: {
  channel: Channel;
  showUnread?: boolean;
}) => {
  const {currentTheme} = useContext(ThemeContext);

  const color =
    showUnread && channel.unread
      ? currentTheme.foregroundPrimary
      : currentTheme.foregroundSecondary;
  const radius =
    channel.channel_type === 'DirectMessage' || channel.channel_type === 'Group'
      ? 10000
      : 0;
  return channel.generateIconURL && channel.generateIconURL() ? (
    <Image
      source={{
        uri: channel.generateIconURL(),
      }}
      style={{
        width: 24,
        height: 24,
        borderRadius: radius,
      }}
    />
  ) : channel.channel_type === 'DirectMessage' ? (
    <MaterialCommunityIcon name="at" size={24} color={color} />
  ) : channel.channel_type === 'VoiceChannel' ? (
    <MaterialIcon name="volume-up" size={24} color={color} />
  ) : (
    <MaterialIcon name="tag" size={24} color={color} />
  );
};
