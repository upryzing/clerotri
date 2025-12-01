import {
  Pressable,
  type PressableProps,
  View,
  type ViewProps,
} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';

export function SettingsEntry(props: ViewProps) {
  let newProps = {...props};

  if (!newProps.style) {
    newProps.style = {};
  }
  newProps.style = {
    ...localStyles.settingsEntry,
    // @ts-expect-error the type error seems to be related to the various ways you can specify style props but it works so shhhh
    ...newProps.style,
  };

  return <View {...newProps} />;
}

export function PressableSettingsEntry(props: PressableProps) {
  let newProps = {...props};

  if (!newProps.style) {
    newProps.style = {};
  }

  newProps.style = {
    ...localStyles.settingsEntry,
    // @ts-expect-error the type error seems to be related to the various ways you can specify style props but it works so shhhh
    ...newProps.style,
  };

  return <Pressable {...newProps} />;
}

const localStyles = StyleSheet.create(currentTheme => ({
  settingsEntry: {
    flexDirection: 'row',
    padding: commonValues.sizes.medium,
    marginVertical: commonValues.sizes.small,
    backgroundColor: currentTheme.backgroundSecondary,
    borderRadius: commonValues.sizes.small,
    alignItems: 'center',
  },
}));
