import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import {Pressable, View} from 'react-native';
import {StyleSheet, UnistylesRuntime} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

import {BackButton, Input, Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {LineSeparator} from '@clerotri/components/layout';
import {commonValues, themes} from '@clerotri/lib/themes';
import type {ThemeColour, ThemeEditorProps} from '@clerotri/lib/types';
import {
  getUnistylesThemes,
  setCustomThemeCollection,
} from '@clerotri/lib/themes/utils';

type NewColourValue = {
  id: ThemeColour;
  newValue: string;
};

const ChangedColoursContext = createContext<{
  changedColours: ThemeColour[];
  setChangedColours: Dispatch<SetStateAction<ThemeColour[]>>;
}>({changedColours: [], setChangedColours: () => {}});

const NewValuesContext = createContext<{
  newValues: NewColourValue[];
  setNewValues: Dispatch<SetStateAction<NewColourValue[]>>;
}>({newValues: [], setNewValues: () => {}});

const InvalidColoursContext = createContext<{
  invalidColours: ThemeColour[];
  setInvalidColours: Dispatch<SetStateAction<ThemeColour[]>>;
}>({invalidColours: [], setInvalidColours: () => {}});

const ColourEntry = ({
  colour,
  initialValue,
}: {
  colour: ThemeColour;
  initialValue: string;
}) => {
  const {changedColours, setChangedColours} = useContext(ChangedColoursContext);
  const {setNewValues} = useContext(NewValuesContext);
  const {invalidColours, setInvalidColours} = useContext(InvalidColoursContext);

  const [value, setValue] = useState(initialValue);
  const [invalid, setInvalid] = useState(false);

  return (
    <View style={localStyles.colourContainer}>
      <View style={localStyles.colourContainerHeader}>
        <Text useNewText style={localStyles.colourContainerHeaderText}>
          {colour}
        </Text>
        {invalid && (
          <Text useNewText colour={'error'}>
            Invalid value
          </Text>
        )}
      </View>
      <View style={localStyles.colourContainerInnerRadius}>
        <View style={localStyles.colourContainerInner(value.trim())}>
          <Input
            skipRegularStyles
            value={value}
            onChangeText={v => {
              setValue(v);
              const trimmedColour = v.trim();

              // console.log(
              //     `${initialValue}, ${v}, ${trimmedColour}, ${trimmedColour === initialValue}, ${changedColours.includes(colour)}`
              //  );

              if (
                trimmedColour !== initialValue &&
                !changedColours.includes(colour)
              ) {
                setChangedColours(current => [...current, colour]);
                setNewValues(current => {
                  const filteredCurrent = current.filter(c => c.id !== colour);
                  return [
                    ...filteredCurrent,
                    {id: colour, newValue: trimmedColour},
                  ];
                });
              } else if (
                trimmedColour === initialValue &&
                changedColours.includes(colour)
              ) {
                setChangedColours(current => current.filter(c => c !== colour));
                setNewValues(current => current.filter(c => c.id !== colour));
              } else if (
                trimmedColour !== initialValue &&
                changedColours.includes(colour)
              ) {
                setNewValues(current => {
                  const filteredCurrent = current.filter(c => c.id !== colour);
                  return [
                    ...filteredCurrent,
                    {id: colour, newValue: trimmedColour},
                  ];
                });
              }

              // adapted from https://regex101.com/r/2GAAVC/1
              const isValidHEXCode = trimmedColour.match(
                /^#(?:[\da-f]{3}){1,2}$|^#(?:[\da-f]{4}){1,2}$/gim,
              );

              if (!isValidHEXCode) {
                setInvalid(true);
                if (!invalidColours.includes(colour)) {
                  setInvalidColours(current => [...current, colour]);
                }
              } else {
                setInvalid(false);
                if (invalidColours.includes(colour)) {
                  setInvalidColours(current =>
                    current.filter(c => c !== colour),
                  );
                }
              }
            }}
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
              onPress={() => {
                setValue(initialValue);
                setChangedColours(current => current.filter(c => c !== colour));
                setNewValues(current => current.filter(c => c.id !== colour));
                setInvalidColours(current => current.filter(c => c !== colour));
              }}
              style={localStyles.colourContainerButton}>
              <MaterialIcon name={'undo'} size={20} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export const ThemeEditorSheet = observer(
  ({setState, data}: {setState: Function; data: ThemeEditorProps}) => {
    const [name, setName] = useState(data.isNew ? '' : 'theme');

    const [changedColours, setChangedColours] = useState<ThemeColour[]>([]);
    const [newValues, setNewValues] = useState<NewColourValue[]>([]);
    const [invalidColours, setInvalidColours] = useState<ThemeColour[]>([]);

    const initialColours = {...themes[data.baseTheme], ...data.initialColours};

    return (
      <View style={localStyles.container}>
        <ChangedColoursContext.Provider
          value={{changedColours, setChangedColours}}>
          <NewValuesContext.Provider value={{newValues, setNewValues}}>
            <InvalidColoursContext.Provider
              value={{invalidColours, setInvalidColours}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBlockEnd: 10,
                }}>
                <BackButton callback={() => setState()} type={'close'} />
                {changedColours.length && name ? (
                  <Pressable
                    onPress={() => {
                      const newThemeColoursObject = {...data.initialColours};
                      for (const value of newValues) {
                        newThemeColoursObject[value.id] = value.newValue;
                      }

                      const finalObject = {
                        base: data.baseTheme,
                        name: name,
                        data: newThemeColoursObject,
                      };

                      setCustomThemeCollection(data.themeID, finalObject);

                      if (data.isNew) {
                        StyleSheet.configure({
                          themes: getUnistylesThemes(),
                        });
                      } else {
                        UnistylesRuntime.updateTheme(
                          `custom-${data.themeID}`,
                          () => ({
                            ...themes[data.baseTheme],
                            ...newThemeColoursObject,
                          }),
                        );
                      }
                      setState();
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 30,
                    }}>
                    <MaterialIcon
                      name={'save'}
                      size={24}
                      color={
                        !invalidColours.length
                          ? 'foregroundPrimary'
                          : 'foregroundSecondary'
                      }
                    />
                  </Pressable>
                ) : null}
              </View>
              <KeyboardAwareScrollView
                bottomOffset={22}
                style={{
                  flex: 1,
                }}
                contentContainerStyle={localStyles.innerContainer}
                showsVerticalScrollIndicator={false}>
                <Text type={'h1'}>
                  {data.isNew ? 'Create' : 'Edit'} theme{' '}
                  {`${changedColours.length} ${invalidColours.length} ${newValues.length}`}
                </Text>
                <Text
                  useNewText
                  colour={'foregroundSecondary'}
                  style={{marginBlockEnd: commonValues.sizes.medium}}>
                  Based on Dark
                </Text>

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
                  {Object.entries(initialColours).map(([colour, value]) => {
                    return colour !== 'generalBorderWidth' &&
                      colour !== 'contentType' ? (
                      <ColourEntry
                        key={`theme-editor-${colour}`}
                        colour={colour as ThemeColour}
                        initialValue={`${value}`}
                      />
                    ) : null;
                  })}
                </View>
              </KeyboardAwareScrollView>
            </InvalidColoursContext.Provider>
          </NewValuesContext.Provider>
        </ChangedColoursContext.Provider>
      </View>
    );
  },
);

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  container: {
    flex: 1,
    paddingInline: commonValues.sizes.xl,
    paddingBlockStart: commonValues.sizes.xl + rt.insets.top,
    backgroundColor: currentTheme.backgroundPrimary,
  },
  innerContainer: {
    paddingBlockEnd: commonValues.sizes.xl + rt.insets.bottom,
  },
  colourContainer: {
    backgroundColor: currentTheme.background,
    borderRadius: commonValues.sizes.medium,
  },
  colourContainerHeader: {
    margin: commonValues.sizes.large,
  },
  colourContainerHeaderText: {
    fontWeight: 'bold',
  },
  // due to (I assume) a Unistyles bug, changing the backgroud colour to a non-valid value and back drops the border radius.
  // so wrap the inner container in another View that applies the radius
  colourContainerInnerRadius: {
    borderRadius: commonValues.sizes.medium,
    overflow: 'hidden',
  },
  colourContainerInner: (colour: string) => ({
    flexDirection: 'row',
    backgroundColor: `${colour}`,
    padding: commonValues.sizes.large,
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
