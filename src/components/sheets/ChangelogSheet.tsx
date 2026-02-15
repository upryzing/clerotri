import {useContext, useMemo} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Text} from '@clerotri/components/common/atoms';
import {NewContextButton} from '@clerotri/components/common/buttons';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';
import {generateDonateGradient} from '@clerotri/components/sheets/SettingsSheet';
import {BLUESKY_PROFILE, CHANGELOG, DONATIONS_INFO} from '@clerotri/lib/consts';
import {APP_VERSION} from '@clerotri/lib/metadata';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {openUrl} from '@clerotri/lib/utils';

const changelogParagraphs = [
  'This release includes **better message rendering**, a bunch of styling and design improvements and a new language - French!',
  `Also note that **Clerotri is now on Bluesky!** Get updates and support at [**@clerotri.upryzing.app**](${BLUESKY_PROFILE}).`,
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
        paddingBlockEnd: commonValues.sizes.medium + insets.bottom,
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <View style={{justifyContent: 'center'}}>
        <Text type={'h1'}>v{APP_VERSION}</Text>
        {changelogParagraphs.map((paragraph, index) => (
          <View
            key={`changelog-paragraph-${index}`}
            style={{marginBlockEnd: commonValues.sizes.medium}}>
            <MarkdownView>{paragraph}</MarkdownView>
          </View>
        ))}
      </View>
      <View>
        <NewContextButton
          type={'start'}
          icon={{
            pack: 'community',
            name: 'heart',
            colour: 'accentColor',
          }}
          textString={'Donate'}
          style={{
            justifyContent: 'center',
            experimental_backgroundImage: [donateGradient],
          }}
          onPress={() => {
            openUrl(`${DONATIONS_INFO}_iac_${APP_VERSION}`);
          }}
        />
        <NewContextButton
          type={'end'}
          icon={{pack: 'community', name: 'book-open-variant'}}
          textString={'See full changelog'}
          style={{justifyContent: 'center'}}
          onPress={() => {
            openUrl(CHANGELOG);
          }}
        />
      </View>
    </View>
  );
});
