import {useContext} from 'react';
import {type ColorValue, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type {Server, User, Channel} from 'revolt.js';

import {Avatar} from '@clerotri/components/common/atoms/Avatar';
import {Text} from '@clerotri/components/common/atoms/Text';
import {Username} from '@clerotri/components/common/atoms/Username';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import type {ThemeColour} from '@clerotri/lib/types';

type MiniProfileProps = {
  user?: User;
  scale?: number;
  channel?: Channel;
  server?: Server;
  // color?: string;
  colour?: ThemeColour;
  customColour?: ColorValue;
};

export const MiniProfile = observer(
  ({user, scale, channel, server, colour, customColour}: MiniProfileProps) => {
    const {currentTheme} = useContext(ThemeContext);

    return user || channel ? (
      <View
        key={`mini-profile-${channel?._id ?? user?._id}`}
        style={{
          flexDirection: 'row',
          paddingInline: commonValues.sizes.small,
          gap: 10 * (scale || 1),
        }}>
        {user ? (
          <>
            <Avatar
              key={`mini-profile-${user._id}-avatar`}
              user={user}
              server={server}
              size={35 * (scale || 1)}
              status
            />
            <View key={`mini-profile-${user._id}-text-wrapper`}>
              <Username
                user={user}
                server={server}
                color={
                  customColour || colour
                    ? currentTheme[colour!]
                    : currentTheme.foregroundPrimary
                }
                size={14 * (scale || 1)}
              />
              <Text
                useNewText
                customColour={customColour}
                colour={colour}
                numberOfLines={1}
                style={{
                  marginTop: -3 * (scale || 1),
                  fontSize: 14 * (scale || 1),
                }}>
                {user.online
                  ? user.status?.text || user.status?.presence || 'Online'
                  : 'Offline'}
              </Text>
            </View>
          </>
        ) : channel ? (
          <>
            {channel.generateIconURL() && (
              <Avatar channel={channel} size={35 * (scale || 1)} />
            )}
            <View>
              <Text
                useNewText
                customColour={customColour}
                colour={colour}
                style={{
                  fontSize: 14 * (scale || 1),
                  fontWeight: 'bold',
                }}>
                {channel.name}
              </Text>
              <Text
                useNewText
                customColour={customColour}
                colour={colour}
                style={{
                  marginTop: -3 * (scale || 1),
                  fontSize: 14 * (scale || 1),
                }}>
                {channel?.recipient_ids?.length} members
              </Text>
            </View>
          </>
        ) : null}
      </View>
    ) : (
      <></>
    );
  },
);
