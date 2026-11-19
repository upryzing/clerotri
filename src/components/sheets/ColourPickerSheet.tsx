import {useState} from 'react';
import {type ColorValue, Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import ColourPicker, {
  HueCircular,
  OpacitySlider,
  Panel1,
} from 'reanimated-color-picker';

import {app} from '@clerotri/Generic';
import {BackButton, Button, Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {GapView} from '@clerotri/components/layout';
import {commonValues} from '@clerotri/lib/themes';
import type {ColourPickerProps} from '@clerotri/lib/types';
import {showToast} from '@clerotri/lib/utils';

export const ColourPickerSheet = observer(
  ({setState, data}: {setState: Function; data: ColourPickerProps}) => {
    const {t} = useTranslation();

    const [colour, setColour] = useState(data.initialColour ?? '#000000');

    const onSelectColour = ({hex}: {hex: string}) => {
      setColour(hex);
    };

    return (
      <View style={localStyles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBlockEnd: 10,
          }}>
          <BackButton callback={() => setState()} />
          {
            /* TODO: think on this design a bit more */
            false && colour !== data.initialColour ? (
              <Pressable
                onPress={() => {
                  data.callback(colour);
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
                  color={'foregroundPrimary'}
                />
              </Pressable>
            ) : null
          }
        </View>
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: commonValues.sizes.medium,
            }}>
            <View style={localStyles.colourPreviewCircle(colour)} />
            <Text
              colour={colour}
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 18,
              }}>
              {data.displayedString ?? 'Report this showing as a bug'}
            </Text>
          </View>
          <GapView size={12} />
          <ColourPicker
            style={{alignSelf: 'center', width: '70%'}}
            value={data.initialColour ?? '#000000'}
            onCompleteJS={onSelectColour}>
            <HueCircular containerStyle={localStyles.hueCircleBackground} />
            <GapView size={8} />
            <Panel1 />
            <GapView size={8} />
            <OpacitySlider />
          </ColourPicker>
          <GapView size={12} />
          <Button
            onPress={() => {
              setState(false);
              app.openTextEditModal({
                initialString: colour,
                id: 'role_colour', // TODO: genericise when another component needs this manual editor
                callback: c => {
                  try {
                    // trim any trailing spaces and, if needed, add a hashtag
                    let filteredColour = c.trim();
                    if (!filteredColour.startsWith('#')) {
                      filteredColour = `#${filteredColour}`;
                    }
                    // adapted from https://regex101.com/r/2GAAVC/1
                    const isValidHEXCode = filteredColour.match(
                      /^#(?:[\da-f]{3}){1,2}$|^#(?:[\da-f]{4}){1,2}$/gim,
                    );
                    console.log(filteredColour, isValidHEXCode);
                    if (isValidHEXCode) {
                      data.callback(filteredColour);
                    } else {
                      showToast(
                        t(
                          'app.servers.settings.roles.errors.role_colour_invalid_hex',
                        ),
                      );
                    }
                  } catch (error) {
                    showToast(
                      t(
                        'app.servers.settings.roles.errors.role_colour_generic',
                      ),
                    );
                    console.log(error);
                  }
                },
              });
            }}>
            <Text>{t('app.servers.settings.roles.open_colour_modal')}</Text>
          </Button>
          {/* <GapView size={8} /> */}
          <Button
            onPress={() => {
              setState(false);
              data.callback(colour);
            }}>
            <Text>{t('app.servers.settings.roles.set_colour')}</Text>
          </Button>
        </View>
      </View>
    );
  },
);

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  container: {
    flex: 1,
    paddingInline: commonValues.sizes.xl,
    paddingBlockStart: commonValues.sizes.xl + rt.insets.top,
    paddingBlockEnd: commonValues.sizes.xl + rt.insets.bottom,
    backgroundColor: currentTheme.backgroundPrimary,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: commonValues.sizes.medium,
    backgroundColor: currentTheme.backgroundSecondary,
    borderRadius: commonValues.sizes.medium,
    gap: commonValues.sizes.medium,
  },
  colourContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: currentTheme.backgroundSecondary,
    padding: commonValues.sizes.medium,
    borderRadius: commonValues.sizes.medium,
  },
  colourPreview: (roleColour?: ColorValue | null) => ({
    padding: commonValues.sizes.xl,
    borderRadius: commonValues.sizes.medium,
    marginEnd: commonValues.sizes.medium,
    backgroundColor: roleColour ?? '#00000000',
    ...(!roleColour && {
      outlineColor: currentTheme.foregroundPrimary,
      outlineWidth: commonValues.sizes.xs,
      outlineStyle: 'dashed',
      outlineOffset: -2,
    }),
  }),
  colourPreviewCircle: (roleColour?: ColorValue) => ({
    width: 24,
    height: 24,
    backgroundColor: roleColour,
    borderRadius: 10000,
    borderWidth: commonValues.sizes.small,
    borderColor: currentTheme.backgroundSecondary,
  }),
  hueCircleBackground: {
    backgroundColor: currentTheme.backgroundPrimary,
  },
}));
