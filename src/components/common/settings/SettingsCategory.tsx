import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {useMMKVBoolean} from 'react-native-mmkv';

import {Text} from '@clerotri/components/common/atoms';
import {
  BoolSetting,
  OptionSetting,
  NumberSetting,
  StringSetting,
} from './atoms';
import {
  type CategoryName,
  settings,
  settingsCategories,
  settingsList,
} from '@clerotri/lib/settings';
import {commonValues} from '@clerotri/lib/themes';

export const SettingsCategory = observer(
  ({category, skipMargin}: {category: string; skipMargin?: boolean}) => {
    const [
      showExperimental = settings.getDefault('ui.settings.showExperimental'),
    ] = useMMKVBoolean('ui.settings.showExperimental');

    const [showDev = settings.getDefault('ui.showDeveloperFeatures')] =
      useMMKVBoolean('ui.showDeveloperFeatures');

    return (
      <View
        key={`settings-category-${category}`}
        style={[
          {gap: commonValues.sizes.large},
          !skipMargin && {marginTop: commonValues.sizes.large},
        ]}>
        {settingsList.map(sRaw => {
          try {
            if (
              (sRaw.experimental && !showExperimental) ||
              (sRaw.developer && !showDev) ||
              sRaw.category !== category
            ) {
              return null;
            }
            if (sRaw.type === 'boolean') {
              return (
                <BoolSetting key={`settings-${sRaw.key}-outer`} sRaw={sRaw} />
              );
            }
            if (sRaw.type === 'number') {
              return (
                <NumberSetting key={`settings-${sRaw.key}-outer`} sRaw={sRaw} />
              );
            }
            if (sRaw.type === 'string') {
              return sRaw.options ? (
                <OptionSetting key={`settings-${sRaw.key}-outer`} sRaw={sRaw} />
              ) : (
                <StringSetting key={`settings-${sRaw.key}-outer`} sRaw={sRaw} />
              );
            }
          } catch (err) {
            console.log(err);
          }
        })}
      </View>
    );
  },
);

export const NewSettingsCategory = observer(
  ({category, skipMargin}: {category: CategoryName; skipMargin?: boolean}) => {
        const {t} = useTranslation();

    const [
      showExperimental = settings.getDefault('ui.settings.showExperimental'),
    ] = useMMKVBoolean('ui.settings.showExperimental');

    const [showDev = settings.getDefault('ui.showDeveloperFeatures')] =
      useMMKVBoolean('ui.showDeveloperFeatures');

    return (
      <View
        key={`settings-category-${category}`}
        style={[
          {gap: commonValues.sizes.large},
          !skipMargin && {marginTop: commonValues.sizes.medium},
        ]}>
        {Object.entries(settingsCategories[category]).map(
          ([itemName, itemData]) => {
            if (Array.isArray(itemData)) {
              return (
                <View
                  style={localStyles.groupOuterContainer}
                  key={`${category}-${itemName}`}>
                  {!itemName.startsWith('detatched') && (
                    <Text
                      useNewText
                      style={{
                        margin: commonValues.sizes.large,
                        fontWeight: 'bold',
                      }}
                      >
                      {t(`app.settings_categories.${category}.${itemName}`)}
                    </Text>
                  )}
                  <View style={localStyles.groupInnerContainer}>
                    {itemData.map(settingKey => {
                      // REPLACE WITH OBJECT !!!
                      const setting = settings._fetch(settingKey);
                      if (!setting) return null;

                      if (
                        (setting.experimental && !showExperimental) ||
                        (setting.developer && !showDev)
                      ) {
                        return null;
                      }

                      if (setting.type === 'boolean') {
                        return (
                          <BoolSetting
                            key={`settings-${setting.key}-outer`}
                            sRaw={setting}
                          />
                        );
                      }
                      if (setting.type === 'number') {
                        return (
                          <NumberSetting
                            key={`settings-${setting.key}-outer`}
                            sRaw={setting}
                          />
                        );
                      }
                      if (setting.type === 'string') {
                        return setting.options ? (
                          <OptionSetting
                            key={`settings-${setting.key}-outer`}
                            sRaw={setting}
                          />
                        ) : (
                          <StringSetting
                            key={`settings-${setting.key}-outer`}
                            sRaw={setting}
                          />
                        );
                      }
                    })}
                  </View>
                </View>
              );
            } else {
              return (
                <Text key={itemName} useNewText>
                  {[itemName, itemData.type]}
                </Text>
              );
            }
          },
        )}
      </View>
    );
  },
);

const localStyles = StyleSheet.create(currentTheme => ({
  groupOuterContainer: {
    backgroundColor: currentTheme.backgroundSecondary,
    borderRadius: commonValues.sizes.medium,
  },
  groupInnerContainer: {
    backgroundColor: currentTheme.background,
    padding: commonValues.sizes.large,
    borderRadius: commonValues.sizes.medium,
    gap: commonValues.sizes.large,
  },
}));
