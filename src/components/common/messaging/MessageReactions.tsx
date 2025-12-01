import {Pressable, type PressableProps, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {Message} from 'revolt.js';

import {client} from '@clerotri/lib/client';
import {Text} from '@clerotri/components/common/atoms';
import {Image} from '@clerotri/crossplat/Image';
import {commonValues} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

export const ReactionBox = (props: PressableProps & {active: boolean}) => {
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

    return (
      <ReactionBox onPress={onPress} active={active}>
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

const localStyles = StyleSheet.create(currentTheme => ({
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
}));
