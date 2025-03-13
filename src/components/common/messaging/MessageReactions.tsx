import {useContext} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import type {Message} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {Text} from '@clerotri/components/common/atoms';
import {Image} from '@clerotri/crossplat/Image';
import {commonValues, type Theme, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

export const Reaction = observer(
  ({
    reaction,
    message,
    onPress,
  }: {
    reaction: string;
    message: Message;
    onPress?: () => void;
  }) => {
    const {currentTheme} = useContext(ThemeContext);
    const localStyles = generateLocalStyles(currentTheme);

    const reactors = message.reactions.get(reaction);

    const active = reactors?.has(client.user?._id!) || false;

    const defaultOnPress = () => {
      message.channel?.havePermission('React')
        ? !active
          ? message.react(reaction)
          : message.unreact(reaction)
        : showToast('You cannot react to this message.');
    };

    return (
      <Pressable
        onPress={onPress ?? defaultOnPress}
        style={[localStyles.reaction, active && localStyles.activeReaction]}>
        {reaction.length > 6 && (
          <Image
            style={{minHeight: 15, minWidth: 15}}
            source={{
              uri: `${client.configuration?.features.autumn.url}/emojis/${reaction}`,
            }}
          />
        )}
        <Text>
          {reaction.length <= 6 && reaction} {reactors?.size}
        </Text>
      </Pressable>
    );
  },
);

export const MessageReactions = observer(({msg}: {msg: Message}) => {
  const reactions = [];

  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  for (const key of msg.reactions.keys()) {
    reactions.push(key);
  }

  if (reactions.length > 0) {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: commonValues.sizes.small,
          flexWrap: 'wrap',
        }}>
        {reactions.map(r => {
          return (
            <Reaction
              key={`message-${msg._id}-reaction-${r}`}
              reaction={r}
              message={msg}
            />
          );
        })}
        {msg.channel?.havePermission('React') ? (
          <Pressable
                key={`message-${msg._id}-add-reaction}`}
                onPress={() => app.openAddReaction(msg)}
                style={localStyles.reaction}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcon
                    name="add-reaction"
                    size={20}
                    color={currentTheme.foregroundPrimary}
                  />
                </View>
              </Pressable>
        ) : null}
      </View>
    );
  }
  return <></>;
});

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    reaction: {
      padding: commonValues.sizes.small,
      borderRadius: commonValues.sizes.small,
      borderColor: currentTheme.backgroundTertiary,
      backgroundColor: currentTheme.backgroundSecondary,
      borderWidth: commonValues.sizes.xs,
      marginEnd: commonValues.sizes.small,
      marginVertical: commonValues.sizes.xs,
      flexDirection: 'row',
    },
    activeReaction: {
      borderColor: currentTheme.accentColor,
    },
  });
};
