import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useMMKVNumber} from 'react-native-mmkv';

import type {Message as RevoltMessage} from 'revolt.js';

import {Text, Username} from '@clerotri/components/common/atoms';
import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';
import {settings} from '@clerotri/lib/settings';
import {client} from '@clerotri/lib/client';
import type {IconType} from '@clerotri/lib/types';

const SYSTEM_MESSAGE_ICONS: Record<string, IconType> = {
  text: {
    name: 'info',
    pack: 'regular',
  },
  user_joined: {
    name: 'format-horizontal-align-right',
    pack: 'community',
  },
  user_left: {
    name: 'format-horizontal-align-left',
    pack: 'community',
  },
  user_added: {
    name: 'person-add',
    pack: 'regular',
  },
  user_remove: {
    name: 'person-remove',
    pack: 'regular',
  },
  user_kicked: {
    name: 'person-remove',
    pack: 'regular',
  },
  user_banned: {
    name: 'hammer',
    pack: 'community',
  },
  channel_renamed: {
    name: 'edit',
    pack: 'regular',
  },
  channel_description_changed: {
    name: 'edit-note',
    pack: 'regular',
  },
  channel_icon_changed: {
    name: 'image-edit',
    pack: 'community',
  },
  channel_ownership_changed: {
    name: 'account-key',
    pack: 'community',
  },
  message_pinned: {
    name: 'pin',
    pack: 'community',
  },
  message_unpinned: {
    name: 'pin-off',
    pack: 'community',
  },
};

const SystemMessageIcon = observer(({icon}: {icon: IconType}) => {
  const [size] = useMMKVNumber('ui.messaging.fontSize');

  const commonProps = {
    color: 'foregroundSecondary',
    size: size !== undefined ? size : 14,
    style: {alignSelf: 'center', paddingEnd: 4},
  } as const;

  return icon.pack === 'community' ? (
    <MaterialCommunityIcon name={icon.name} {...commonProps} />
  ) : (
    <MaterialIcon name={icon.name} {...commonProps} />
  );
});

export const SystemMessage = observer(
  ({message, isReply}: {message: RevoltMessage; isReply?: boolean}) => {
    if (!message.system) {
      return <></>;
    }

    let userID = '';

    if (message.system.type !== 'text') {
      switch (message.system.type) {
        case 'channel_ownership_changed':
          userID = message.system.from;
          break;
        case 'channel_description_changed':
        case 'channel_icon_changed':
        case 'channel_renamed':
        case 'message_pinned':
        case 'message_unpinned':
          userID = message.system.by;
          break;
        default:
          userID = message.system.id;
          break;
      }
    }

    return (
      <View
        key={message._id}
        style={{
          ...localStyles.containerCommon,
          ...(!isReply && localStyles.containerPadding),
        }}>
        <SystemMessageIcon icon={SYSTEM_MESSAGE_ICONS[message.system.type]} />
        {message.system.type === 'text' ? (
          <>
            <Text>
              <Text style={{fontWeight: 'bold'}}>System message: </Text>
              {message.system.content}
            </Text>
          </>
        ) : (
          <>
            <Username
              user={client.users.get(userID)}
              server={message.channel?.server}
            />
            {message.system.type === 'user_joined' ? (
              <Text> joined</Text>
            ) : message.system.type === 'user_left' ? (
              <Text> left</Text>
            ) : message.system.type === 'user_banned' ? (
              <Text> was banned</Text>
            ) : message.system.type === 'user_kicked' ? (
              <Text> was kicked</Text>
            ) : message.system.type === 'user_added' ? (
              <Text> was added to the group</Text>
            ) : message.system.type === 'user_remove' ? (
              <Text> was removed from the group</Text>
            ) : message.system.type === 'channel_renamed' ? (
              <Text>
                {' '}
                renamed the channel to{' '}
                <Text style={{fontWeight: 'bold'}}>{message.system.name}</Text>
              </Text>
            ) : message.system.type === 'channel_description_changed' ? (
              <Text> changed the channel description</Text>
            ) : message.system.type === 'channel_icon_changed' ? (
              <Text> changed the channel icon</Text>
            ) : message.system.type === 'channel_ownership_changed' ? (
              <>
                <Text> gave ownership of the group to </Text>
                <Username
                  user={client.users.get(message.system.to)}
                  server={message.channel?.server}
                />
              </>
            ) : message.system.type === 'message_pinned' ? (
              <Text> pinned a message</Text>
            ) : message.system.type === 'message_unpinned' ? (
              <Text> unpinned a message</Text>
            ) : null}
          </>
        )}
      </View>
    );
  },
);

const localStyles = StyleSheet.create({
  containerCommon: {
    flex: 1,
    flexDirection: 'row',
  },
  containerPadding: {
    paddingInlineStart: 10,
    paddingBlockStart: settings.get('ui.messaging.messageSpacing') as number,
  },
});
