import { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { observer } from 'mobx-react-lite';

import type BottomSheetCore from '@gorhom/bottom-sheet';
import { BottomSheet } from '@clerotri/components/common/BottomSheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { app, setFunction } from '@clerotri/Generic';
import { Message, User } from 'revolt.js';
import { client } from '@clerotri/lib/client';
import { commonValues, ThemeContext, Theme } from '@clerotri/lib/themes';
import { MiniProfile } from '../common/profile';
import { ReactionBox } from '../common/messaging/MessageReactions';

type ReactionPile = {
  emoji: string;
  reactors: string[];
};

const Reactors = observer(({message, reaction, style}: {message: Message | null, reaction: string | null, style: StyleProp<ViewStyle>}) => {
  if (!message || !reaction || !message.reactions.get(reaction)) return <></>;

  const rawReactors = Array.from(message.reactions.get(reaction)!.values());
  let reactors: string[] = [];
  for (const r of rawReactors) {
    reactors.push(r);
  }

  return (<>
    {reactors.map((e) => {
      const user = client.users.get(e);
      if (user && user.relationship != 'Blocked')
        return <TouchableOpacity
          style={style}
          onPress={() => {
            app.openProfile(user);
          }}
        >
          <MiniProfile key={`viewreactions-content-${user._id}`} user={user} />
        </TouchableOpacity>
    })}
  </>);
});

export const ViewReactionsSheet = observer(({ message, reaction }: { message: Message | null, reaction: string | null }) => {
  const { currentTheme } = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  const [currentReaction, setCurrentReaction] = useState(reaction);

  const [reactors, setReactors] = useState([] as User[]);

  useEffect(() => {
    if (!message || !currentReaction || !message.reactions.get(currentReaction)) return;

    const rawReactors = Array.from(message.reactions.get(currentReaction)!.values());
    setReactors([]);
    const fetchedReactors = [] as User[];
    for (const r of rawReactors) {
      client.users.fetch(r).then((u) => {
        fetchedReactors.push(u);
        setReactors([...fetchedReactors]);
      });
    }
  }, [message, currentReaction]);

  const rawReactions = Array.from(message?.reactions ?? []);
  let reactions: ReactionPile[] = [];
  for (const r of rawReactions) {
    reactions.push({ emoji: r[0], reactors: Array.from(r[1]) });
  }

  return (
    <View style={{ paddingHorizontal: 16, flex: 1}}>
      <ScrollView horizontal style={{
        marginVertical: commonValues.sizes.small,
        maxHeight: 36,
      }}>
        {reactions?.map((r) => {
          return (
            <ReactionBox
              key={`viewreactions-reaction-${r.emoji}`}
              onPress={() => setCurrentReaction(r.emoji)}
              active={!!currentReaction && r.emoji == currentReaction}
            >
              {r.emoji.length > 6 && (
                <Image
                  style={{minHeight: 15, minWidth: 15}}
                  source={{
                    uri: `${client.configuration?.features.autumn.url}/emojis/${r.emoji}`,
                  }}
                />
              )}
              <Text key={`viewreactions-reaction-${r.emoji}-label`} style={{ color: currentTheme.foregroundPrimary }}>
                {r.emoji.length <= 6 && r.emoji} {r.reactors.length}
              </Text>
            </ReactionBox>
          );
        })}
      </ScrollView>
      <BottomSheetScrollView>
        {reactors.map((user) => {
          if (user && user.relationship != 'Blocked')
            return <TouchableOpacity
              style={localStyles.reactorButton}
              onPress={() => {
                app.openProfile(user);
              }}
            >
              <MiniProfile key={`viewreactions-content-${user._id}`} user={user} />
            </TouchableOpacity>
        })}
      </BottomSheetScrollView>
    </View>
  );
});

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    reactorButton: {
      height: 50,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: currentTheme.backgroundPrimary,
      borderRadius: commonValues.sizes.medium,
      paddingInline: 10,
      marginVertical: commonValues.sizes.small,
      color: currentTheme.foregroundPrimary
    },
  });
};