import { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { observer } from 'mobx-react-lite';

import type BottomSheetCore from '@gorhom/bottom-sheet';
import { BottomSheet } from '@clerotri/components/common/BottomSheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { app, setFunction } from '@clerotri/Generic';
import { Member, Message, User } from 'revolt.js';
import { client } from '@clerotri/lib/client';
import { commonValues, ThemeContext, Theme } from '@clerotri/lib/themes';
import { MiniProfile } from '../common/profile';

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

  const currentReaction = () => message && (reaction && message.reactions.get(reaction) && message.reactions.get(reaction)!.size > 0 && reaction) || message?.reactions.keys().next()?.toString();

  const sheetRef = useRef<BottomSheetCore>(null);

  const [reactors, setReactors] = useState([] as User[]);

  useEffect(() => {
    if (!message || !reaction || !message.reactions.get(reaction)) return;

    const rawReactors = Array.from(message.reactions.get(reaction)!.values());
    setReactors([]);
    const fetchedReactors = [] as User[];
    for (const r of rawReactors) {
      client.users.fetch(r).then((u) => {
        fetchedReactors.push(u);
        setReactors([...fetchedReactors]);
      });
    }
  }, [message, reaction]);

  const rawReactions = Array.from(message?.reactions ?? []);
  let reactions: ReactionPile[] = [];
  for (const r of rawReactions) {
    reactions.push({ emoji: r[0], reactors: Array.from(r[1]) });
  }

  return (
    <BottomSheet outerScroll={'custom'} sheetRef={sheetRef}>
      <Text>DSGGSDGSDGSDGSDG</Text>
        <View style={{ paddingHorizontal: 16, height: 200}}>
          <ScrollView horizontal style={{
            marginVertical: commonValues.sizes.small,
            maxHeight: 36,
          }}>
            {reactions?.map((r) => {
              return (
                <Pressable
                  key={`viewreactions-reaction-${r.emoji}`}
                  style={{
                    padding: commonValues.sizes.small,
                    borderRadius: commonValues.sizes.small,
                    borderColor: reaction && r.emoji == reaction
                      ? currentTheme.accentColor
                      : currentTheme.backgroundTertiary,
                    backgroundColor: currentTheme.backgroundSecondary,
                    borderWidth: commonValues.sizes.xs,
                    marginEnd: commonValues.sizes.small,
                    marginVertical: commonValues.sizes.xs,
                  }}
                  onPress={() => setReaction(r.emoji)}
                >
                  <View style={{ flexDirection: 'row' }}>
                    {r.emoji.length > 6 && (
                      <Image
                        style={{ minHeight: 20, minWidth: 20 }}
                        source={{
                          uri: `${client.configuration?.features.autumn.url}/emojis/${r.emoji}`,
                        }}
                      />
                    )}
                    <Text key={`viewreactions-reaction-${r.emoji}-label`} style={{ color: currentTheme.foregroundPrimary }}>
                      {r.emoji.length <= 6 && r.emoji} {r.reactors.length}
                    </Text>
                  </View>
                </Pressable>
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
    </BottomSheet>
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