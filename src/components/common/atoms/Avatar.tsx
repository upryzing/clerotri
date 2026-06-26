import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {API, Channel, Server, User} from 'revolt.js';

import {Image} from '@clerotri/crossplat/Image';
import {app} from '@clerotri/Generic';
import {settings} from '@clerotri/lib/settings';
import {client} from '@clerotri/lib/client';
import type {ThemeColour} from '@clerotri/lib/types';

type AvatarProps = {
  channel?: Channel;
  user?: User | null;
  server?: Server;
  status?: boolean;
  size?: number;
  backgroundColor?: ThemeColour;
  masquerade?: string;
  pressable?: boolean;
};

const statusScale = 2.7;

export const Avatar = observer(
  ({
    channel,
    user,
    server,
    status,
    size = 35,
    backgroundColor,
    masquerade,
    pressable,
  }: AvatarProps) => {
    let memberObject =
      server && user
        ? client.members.getKey({
            server: server?._id,
            user: user?._id,
          })
        : null;

    const userStatus = user?.online
      ? user.status?.presence || 'Online'
      : 'Offline';

    let Container = pressable
      ? ({children}: {children: any}) => (
          <Pressable
            onPress={() => app.openImage(memberObject?.avatar || user?.avatar)}>
            {children}
          </Pressable>
        )
      : View;

    if (user) {
      const imageURL = masquerade
        ? masquerade
        : server &&
            memberObject?.generateAvatarURL &&
            memberObject?.generateAvatarURL()
          ? memberObject?.generateAvatarURL()
          : user?.generateAvatarURL();

      if (!imageURL) {
        console.log(user._id);
        return <></>;
      }

      return (
        <Container>
          <Image
            source={{
              uri: imageURL,
            }}
            style={{width: size || 35, height: size || 35, borderRadius: 10000}}
          />
          {status ? (
            <View
              style={localStyles.status(size, userStatus, backgroundColor)}
            />
          ) : null}
          {masquerade && settings.get('ui.messaging.showMasqAvatar') ? (
            <Image
              style={localStyles.masquerade(size, backgroundColor)}
              source={{
                uri:
                  server &&
                  memberObject?.generateAvatarURL &&
                  memberObject?.generateAvatarURL()
                    ? memberObject?.generateAvatarURL()
                    : user?.generateAvatarURL(),
              }}
            />
          ) : null}
        </Container>
      );
    }
    if (channel) {
      return (
        <View>
          {channel?.generateIconURL() ? (
            <Image
              source={{
                uri: channel?.generateIconURL(),
              }}
              style={{
                width: size || 35,
                height: size || 35,
                borderRadius: 10000,
              }}
            />
          ) : null}
        </View>
      );
    }
    return <></>;
  },
);

const localStyles = StyleSheet.create(currentTheme => ({
  status: (
    size: number,
    status: API.Presence | 'Offline',
    backgroundColour?: ThemeColour,
  ) => ({
    width: Math.round(size / statusScale),
    height: Math.round(size / statusScale),
    backgroundColor: currentTheme[`status${status}`],
    borderRadius: 10000,
    marginTop: -Math.round(size / statusScale),
    left: size - Math.round(size / statusScale),
    borderWidth: Math.round(size / 20),
    borderColor: currentTheme[backgroundColour ?? 'backgroundPrimary'],
  }),
  masquerade: (size: number, backgroundColour?: ThemeColour) => ({
    width: Math.round(size / statusScale),
    height: Math.round(size / statusScale),
    marginBottom: -Math.round(size / statusScale),
    bottom: size,
    borderRadius: 10000,
    borderWidth: Math.round(size / 30),
    borderColor: currentTheme[backgroundColour ?? 'backgroundPrimary'],
  }),
}));
