import {useContext} from 'react';
import {Pressable, type PressableProps, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {app} from '@clerotri/Generic';

import type {Message} from 'revolt.js';

import {client} from '@clerotri/lib/client';
import {Text} from '@clerotri/components/common/atoms';
import {Image} from '@clerotri/crossplat/Image';
import {commonValues, type Theme, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

export const ReactionBox = (props: PressableProps & {active: boolean}) => {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  return (
    <Pressable
      style={[localStyles.reaction, props.active && localStyles.activeReaction]}
      {...props}
    />
  );
};

const Reaction = observer(
  ({reaction, message}: {reaction: string; message: Message}) => {
    const reactors = message.reactions.get(reaction);

    const active = reactors?.has(client.user?._id!) || false;

    const onPress = () => {
      message.channel?.havePermission('React')
        ? !active
          ? message.react(reaction)
          : message.unreact(reaction)
        : showToast('You cannot react to this message.');
    };

    const onLongPress = () => {
      app.openViewReactions(message, reaction);
    };

    return (
      <ReactionBox onPress={onPress} onLongPress={onLongPress} active={active}>
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
      </ReactionBox>
    );
  },
);

export const MessageReactions = observer(({msg}: {msg: Message}) => {
  const reactions = [];

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
