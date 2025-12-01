import {createContext, useState} from 'react';
import {Pressable, type TextStyle} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {Text} from '@clerotri/components/common/atoms';
import {commonValues} from '@clerotri/lib/themes';

const spoilerStyles = StyleSheet.create(currentTheme => ({
  commonStyles: {
    flexDirection: 'row',
    // align it properly (see also https://github.com/facebook/react-native/issues/31955)
    transform: [
      {
        translateY: 6,
      },
    ],

    paddingHorizontal: commonValues.sizes.xs,
    borderRadius: commonValues.sizes.small,
  },
  hiddenSpoiler: {
    backgroundColor: currentTheme.background,
  },
  revealedSpoiler: {
    backgroundColor: currentTheme.backgroundSecondary,
  },
  commonTextStyles: {
    backgroundColor: 'transparent',
  },
  hiddenSpoilerText: {
    color: 'transparent',
  },
  revealedSpoilerText: {
    color: currentTheme.foregroundPrimary,
  },
}));

export const SpoilerContext = createContext(false);

export const SpoilerWrapper = ({content}: {content: any}) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <SpoilerContext.Provider value={revealed}>
      <Pressable
        style={{
          ...spoilerStyles.commonStyles,
          ...(revealed
            ? spoilerStyles.revealedSpoiler
            : spoilerStyles.hiddenSpoiler),
        }}
        onPress={() => setRevealed(!revealed)}>
        {content}
      </Pressable>
    </SpoilerContext.Provider>
  );
};

export const Spoiler = ({
  node,
  isRevealed,
  styles,
  inheritedStyles,
}: {
  node: any;
  isRevealed: boolean;
  styles: TextStyle;
  inheritedStyles: any;
}) => {
  return (
    <Text
      accessibilityLabel={isRevealed ? node.content : 'Hidden spoiler'}
      style={{
        ...inheritedStyles,
        ...styles,
        ...spoilerStyles.commonTextStyles,
        ...(isRevealed
          ? spoilerStyles.revealedSpoilerText
          : spoilerStyles.hiddenSpoilerText),
      }}>
      {
        /* FIXME: Rendering emoji reveals spoiler markdown
                  renderEmoji(node.content)*/
        node.content
      }
    </Text>
  );
};
