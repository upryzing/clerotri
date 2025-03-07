import { useContext, useRef, useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import EmojiSelector from 'react-native-emoji-selector';
// import EmojiPicker from 'emoji-picker-react';

import type BottomSheetCore from '@gorhom/bottom-sheet';

import type { Message } from 'revolt.js';

import { client } from '@clerotri/lib/client';
import { showToast } from '@clerotri/lib/utils';
import { app, setFunction } from '@clerotri/Generic';
import { BottomSheet } from '@clerotri/components/common/BottomSheet';
import { ThemeContext } from '@clerotri/lib/themes';
import { useBackHandler } from '@clerotri/lib/ui';

export const AddReactionSheet = observer(() => {
  const { currentTheme } = useContext(ThemeContext);

  const [message, setMessage] = useState(null as Message | null);

  const sheetRef = useRef<BottomSheetCore>(null);

  useBackHandler(() => {
    if (message) {
      sheetRef.current?.close();
      return true;
    }

    return false;
  });

  setFunction('openAddReaction', async (m: Message | null) => {
    setMessage(m);
    m ? sheetRef.current?.expand() : sheetRef.current?.close();
  });

  function selectEmoji(emoji: string) {
    if (!message) return;
    
    const reaction = message.reactions.get(emoji) || [];
    
    message.channel?.havePermission('React')
      ? !Array.from(reaction).includes(client.user?._id!)
        ? message.react(emoji)
        : message.unreact(emoji)
      : showToast('You cannot react to this message.');
    app.openAddReaction(null);
  }

  return (
    // BottomSheet cannot wrap our children in a scroll view because it will
    // create a nested set of scroll views which causes issues
    <BottomSheet innerScroll={true} sheetRef={sheetRef}>
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        {!message ? (
          <></>
        ) : (
          <EmojiSelector
            onEmojiSelected={selectEmoji}
            columns={8} />
        )}
      </View>
    </BottomSheet>
  );
});
