import {useContext} from 'react';
import {View} from 'react-native';
// import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {Server, User} from 'revolt.js';

import {settings} from '@clerotri/lib/settings';
import {client} from '@clerotri/lib/client';
import {Text} from './Text';
import {USER_IDS} from '@clerotri/lib/consts';
import {ThemeContext} from '@clerotri/lib/themes';
import {getColour} from '@clerotri/lib/utils';
import {MaterialCommunityIcon} from '../icons';

type UsernameCoreProps = {
  user: User;
  size: number;
  name: string;
  colour: string;
  skipDisplayName?: boolean;
};

type UsernameBadgeProps = {
  user: User;
  size?: number;
  masquerade?: string | null;
};

type UsernameProps = {
  server?: Server;
  user?: User | null;
  noBadge?: boolean;
  size?: number;
  masquerade?: string | null;
  color?: string;
  skipDisplayName?: boolean;
  useNewStructure?: boolean;
};

const UsernameCore = observer(
  ({user, size, name, colour, skipDisplayName}: UsernameCoreProps) => {
    return (
      <Text
        customColour={colour}
        style={{
          fontWeight: 'bold',
          fontSize: size,
        }}>
        {skipDisplayName ? '@' : null}
        {name}
        {skipDisplayName ? `#${user!.discriminator}` : null}
      </Text>
    );
  },
);

const UsernameBadge = observer(
  ({user, size, masquerade}: UsernameBadgeProps) => {
    const badgeSize = size || 14;

    const bridgedMessage =
      USER_IDS.bridgeBots.includes(user._id) && masquerade !== undefined;

    return (
      <>
        {bridgedMessage ? (
          <MaterialCommunityIcon
            name={'bridge'}
            color={'accentColor'}
            size={badgeSize * 1.4}
          />
        ) : (
          <>
            {user?.bot ? (
              <MaterialCommunityIcon
                name={'robot'}
                color={'accentColor'}
                size={badgeSize * 1.2}
              />
            ) : null}
            {masquerade ? (
              <MaterialCommunityIcon
                name={'domino-mask'}
                color={'accentColor'}
                size={badgeSize * 1.4}
              />
            ) : null}
            {user?._id === USER_IDS.platformModeration ? (
              <MaterialCommunityIcon
                name={'shield-check'}
                color={'accentColor'}
                size={badgeSize * 1.2}
              />
            ) : null}
          </>
        )}
      </>
    );
  },
);

export const Username = observer(
  ({
    server,
    user,
    noBadge,
    size,
    masquerade,
    color,
    skipDisplayName,
    useNewStructure,
  }: UsernameProps) => {
    const {currentTheme} = useContext(ThemeContext);

    if (!user || typeof user !== 'object') {
      return (
        <Text style={size ? {fontSize: size} : {}}>{'<Unknown User>'}</Text>
      );
    }

    const memberObject = server
      ? client.members.getKey({
          server: server?._id,
          user: user._id,
        })
      : undefined;

    let roleColour = color
      ? getColour(color, currentTheme)
      : currentTheme.foregroundPrimary;

    const name =
      server && memberObject?.nickname
        ? memberObject?.nickname
        : !skipDisplayName
          ? (user.display_name ?? user.username)
          : user.username;

    if (server && memberObject?.roles && memberObject?.roles?.length > 0) {
      let srv = client.servers.get(memberObject._id.server);
      if (srv?.roles) {
        roleColour = getColour(
          memberObject.roleColour ?? currentTheme.foregroundPrimary,
          currentTheme,
        );
      }
    }

    const usernameSize =
      size || (settings.get('ui.messaging.fontSize') as number) || 14;

    return useNewStructure ? (
      <Text>
        <UsernameCore
          user={user}
          size={usernameSize}
          colour={roleColour}
          name={masquerade ?? name}
          skipDisplayName={skipDisplayName}
        />
        {!noBadge ? (
          <UsernameBadge user={user} size={size} masquerade={masquerade} />
        ) : null}
      </Text>
    ) : (
      <View style={{flexDirection: 'row'}}>
        <UsernameCore
          user={user}
          size={usernameSize}
          colour={roleColour}
          name={masquerade ?? name}
          skipDisplayName={skipDisplayName}
        />
        {!noBadge ? (
          <UsernameBadge user={user} size={size} masquerade={masquerade} />
        ) : null}
      </View>
    );
  },
);

// const localStyles = StyleSheet.create(currentTheme => ({
//   badge: (badgeSize: number) => ({
//     color: currentTheme.accentColorForeground,
//     backgroundColor: currentTheme.accentColor,
//     marginInlineStart: badgeSize * 0.4,
//     paddingHorizontal: badgeSize * 0.4,
//     alignSelf: 'center' as const,
//     borderRadius: 2,
//     fontSize: badgeSize,
//     top: badgeSize * 0.1,
//   }),
// }));
