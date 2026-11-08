import {useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import {contrastColor} from 'react-native-reanimated';

import type {Server} from 'revolt.js';

import {client} from '@clerotri/lib/client';
import {
  BackButton,
  Button,
  GeneralAvatar,
  Input,
  Text,
} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {LineSeparator} from '@clerotri/components/layout';
import {commonValues} from '@clerotri/lib/themes';
import type {ThemeEditorProps} from '@clerotri/lib/types';

const ColourEntry = ({
  colour,
  initialValue,
}: {
  colour: string;
  initialValue: string;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <View style={localStyles.colourContainer}>
      <Text style={localStyles.colourContainerHeader}>{colour}</Text>
      <View style={localStyles.colourContainerInner(value)}>
        <Input
          skipRegularStyles
          value={value}
          onChangeText={v => setValue(v)}
          placeholder={'Enter a HEX code...'}
          style={{
            padding: commonValues.sizes.large,
            flexGrow: 1,
          }}
        />
        <Pressable style={localStyles.colourContainerButton}>
          <MaterialIcon name={'colorize'} size={20} />
        </Pressable>
        {value !== initialValue && (
          <Pressable
            onPress={() => setValue(initialValue)}
            style={localStyles.colourContainerButton}>
            <MaterialIcon name={'undo'} size={20} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export const ThemeEditorSheet = observer(
  ({setState, data}: {setState: Function; data: ThemeEditorProps}) => {
    const [name, setName] = useState(data.isNew ? '' : 'theme');

    return (
      <View style={localStyles.container}>
        <BackButton callback={() => setState()} type={'close'} margin />
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}>
          <Text type={'h1'}>{data.isNew ? 'Create' : 'Edit'} theme</Text>

          <Text useNewText type={'h2'}>
            Theme name
          </Text>
          <Input
            value={name}
            onChangeText={v => setName(v)}
            placeholder={'Enter a theme name...'}
          />
          <LineSeparator
            style={{
              marginInline: commonValues.sizes.medium,
              marginBlock: commonValues.sizes.large,
            }}
          />

          <View style={{gap: commonValues.sizes.medium}}>
            {Object.entries(data.initialColours).map(([colour, value]) => {
              return colour !== 'generalBorderWidth' &&
                colour !== 'contentType' ? (
                <ColourEntry
                  key={`theme-editor-${colour}`}
                  colour={colour}
                  initialValue={value}
                />
              ) : null;
            })}
          </View>
        </ScrollView>
      </View>
    );
  },
);

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  container: {
    flex: 1,
    padding: commonValues.sizes.xl,
    paddingBlockStart: commonValues.sizes.xl + rt.insets.top,
    paddingBlockEnd: commonValues.sizes.xl + rt.insets.bottom,
    backgroundColor: currentTheme.backgroundPrimary,
  },
  colourContainer: {
    backgroundColor: currentTheme.background,
    borderRadius: commonValues.sizes.medium,
  },
  colourContainerHeader: {
    fontWeight: 'bold',
    margin: commonValues.sizes.large,
  },
  colourContainerInner: (colour: string) => ({
    flexDirection: 'row',
    backgroundColor: `${colour}`,
    padding: commonValues.sizes.large,
    borderRadius: commonValues.sizes.medium,
    gap: commonValues.sizes.small,
  }),
  colourContainerButton: {
    backgroundColor: currentTheme.backgroundSecondary,
    borderRadius: commonValues.sizes.medium,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
