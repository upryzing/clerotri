import {useState} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {settings, settingsList} from '@clerotri/Generic';
import {BoolSetting, OptionSetting, StringNumberSetting} from './atoms';

export const SettingsCategory = observer(({category}: {category: string}) => {
  const [showExperimental, setShowExperimental] = useState(
    settings.get('ui.settings.showExperimental') as boolean,
  );

  const [showDev, setShowDev] = useState(
    settings.get('ui.showDeveloperFeatures') as boolean,
  );

  return (
    <View key={`settings-category-${category}`}>
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
              <BoolSetting
                key={`settings-${sRaw.key}-outer`}
                sRaw={sRaw}
                experimentalFunction={setShowExperimental}
                devFunction={setShowDev}
              />
            );
          } else if (sRaw.type === 'string' || sRaw.type === 'number') {
            return sRaw.options ? (
              <OptionSetting key={`settings-${sRaw.key}-outer`} sRaw={sRaw} />
            ) : (
              <StringNumberSetting
                key={`settings-${sRaw.key}-outer`}
                sRaw={sRaw}
              />
            );
          }
        } catch (err) {
          console.log(err);
        }
      })}
    </View>
  );
});
