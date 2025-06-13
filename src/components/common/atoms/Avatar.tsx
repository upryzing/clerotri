import {useContext} from 'react';
import {Pressable, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type {Server, User, Channel} from 'revolt.js';

import {Image} from '@clerotri/crossplat/Image';
import {app, settings} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {ThemeContext} from '@clerotri/lib/themes';

type AvatarProps = {
  channel?: Channel;
  user?: User | null;
  server?: Server;
  status?: boolean;
  size?: number;
  backgroundColor?: string;
  masquerade?: string;
  pressable?: boolean;
};

export const Avatar = observer(
  ({
    channel,
    user,
    server,
    status,
    size,
    backgroundColor,
    masquerade,
    pressable,
  }: AvatarProps) => {
    const {currentTheme} = useContext(ThemeContext);

    let memberObject =
      server && user
        ? client.members.getKey({
            server: server?._id,
            user: user?._id,
          })
        : null;
    let statusColor;
    let statusScale = 2.7;
    if (status) {
      const s = user?.online ? user.status?.presence || 'Online' : 'Offline';
      statusColor = currentTheme[`status${s}`];
    }
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
              uri: imageURL
            }}
            style={{width: size || 35, height: size || 35, borderRadius: 10000}}
          />
          {status ? (
            <View
              style={{
                width: Math.round(size / statusScale),
                height: Math.round(size / statusScale),
                backgroundColor: statusColor,
                borderRadius: 10000,
                marginTop: -Math.round(size / statusScale),
                left: size - Math.round(size / statusScale),
                borderWidth: Math.round(size / 20),
                borderColor: backgroundColor || currentTheme.backgroundPrimary,
              }}
            />
          ) : null}
          {masquerade && settings.get('ui.messaging.showMasqAvatar') ? (
            <Image
              style={{
                width: Math.round(size / statusScale),
                height: Math.round(size / statusScale),
                marginBottom: -Math.round(size / statusScale),
                bottom: size,
                borderRadius: 10000,
                borderWidth: Math.round(size / 30),
                borderColor: backgroundColor || currentTheme.backgroundPrimary,
              }}
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
                uri:
                  channel?.generateIconURL(),
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
