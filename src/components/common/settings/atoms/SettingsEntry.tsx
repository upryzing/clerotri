import {
  Pressable,
  type PressableProps,
  View,
  type ViewProps,
} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';

export function SettingsEntry(props: ViewProps) {
  const {style, ...cleanProps} = props;

  return <View style={[localStyles.settingsEntry, style]} {...cleanProps} />;
}

export function PressableSettingsEntry(props: PressableProps) {
  const {style, ...cleanProps} = props;

  return (
    // @ts-expect-error Pressables can use functions as style props. not sure how to handle it
    // at the moment but at least basic styles work
    <Pressable style={[localStyles.settingsEntry, style]} {...cleanProps} />
  );
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
