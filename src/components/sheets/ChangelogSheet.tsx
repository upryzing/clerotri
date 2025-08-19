import {useContext, useMemo} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ContextButton, Text} from '@clerotri/components/common/atoms';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';
import {generateDonateGradient} from '@clerotri/components/sheets/SettingsSheet';
import {DONATIONS_INFO, WEBLATE} from '@clerotri/lib/consts';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {appVersion} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {openUrl} from '@clerotri/lib/utils';

const changelogParagraphs = [
  'This release includes a **revamped settings menu**, improvements to the **sessions settings menu** support for **2 new languages** and more!',
  'It also (finally!) includes **in-app changelogs**. These can be disabled in [settings](clerotri://settings/functionality).',
];

export const ChangelogSheet = observer(() => {
  const insets = useSafeAreaInsets();
  const {currentTheme} = useContext(ThemeContext);

  const donateGradient = useMemo(
    () => generateDonateGradient(currentTheme),
    [currentTheme],
  );

  return (
    <View
      style={{
        padding: commonValues.sizes.xl,
        paddingBlockEnd: commonValues.sizes.xl + insets.bottom,
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <View style={{justifyContent: 'center'}}>
        <Text type={'h1'}>v{appVersion}</Text>
        {changelogParagraphs.map((paragraph, index) => (
          <View
            key={`changelog-paragraph-${index}`}
            style={{marginBlockEnd: commonValues.sizes.medium}}>
            <MarkdownView>{paragraph}</MarkdownView>
          </View>
        ))}
      </View>
      <View>
        <ContextButton
          style={{
            justifyContent: 'center',
            experimental_backgroundImage: [donateGradient],
          }}
          onPress={() => {
            openUrl(`${DONATIONS_INFO}_iac_${appVersion}`);
          }}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcon
              name={'heart'}
              color={currentTheme.accentColor}
              size={24}
            />
          </View>
          <Text>Donate</Text>
        </ContextButton>
        <ContextButton
          style={{justifyContent: 'center'}}
          onPress={() => {
            openUrl(WEBLATE);
          }}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcon
              name={'book-open-variant'}
              color={currentTheme.foregroundPrimary}
              size={24}
            />
          </View>
          <Text>See full changelog</Text>
        </ContextButton>
      </View>
    </View>
  );
});
