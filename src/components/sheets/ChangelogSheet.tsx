import {useContext, useMemo} from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {Text} from '@clerotri/components/common/atoms';
import {NewContextButton} from '@clerotri/components/common/buttons';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';
import {generateDonateGradient} from '@clerotri/components/sheets/SettingsSheet';
import {BLUESKY_PROFILE, CHANGELOG, DONATIONS_INFO} from '@clerotri/lib/consts';
import {APP_VERSION} from '@clerotri/lib/metadata';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {openUrl} from '@clerotri/lib/utils';

const releaseDate = 'foo/bar/2026';

const changelogParagraphs = [
  'This release includes **better message rendering**, a bunch of styling and design improvements and a new language - French!',
  `Also note that **Clerotri is now on Bluesky!** Get updates and support at [**@clerotri.upryzing.app**](${BLUESKY_PROFILE}).`,
];

const ChangelogHeader = ({isNewlyUpdated}: {isNewlyUpdated: boolean}) => {
  const {t} = useTranslation();

  return (
    <View>
      <Text type={'h1'}>
        {t(`app.changelog.header${isNewlyUpdated ? '_newly_updated' : ''}`, {
          version: APP_VERSION,
        })}
      </Text>
      <Text useNewText colour={'foregroundSecondary'}>
        {t('app.changelog.released_on', {date: releaseDate})}
      </Text>
      <View style={localStyles.paragraphsContainer}>
        {changelogParagraphs.map((paragraph, index) => (
          <View key={`changelog-paragraph-${index}`}>
            <MarkdownView>{paragraph}</MarkdownView>
          </View>
        ))}
      </View>
    </View>
  );
};

const ChangelogButtons = ({setState}: {setState: (show: boolean) => void}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const donateGradient = useMemo(
    () => generateDonateGradient(currentTheme),
    [currentTheme],
  );

  return (
    <View>
      <NewContextButton
        type={'start'}
        icon={{
          pack: 'community',
          name: 'heart',
          colour: 'accentColor',
        }}
        textString={t('app.changelog.donate')}
        style={[
          localStyles.changelogButton,
          {experimental_backgroundImage: [donateGradient]},
        ]}
        onPress={() => {
          openUrl(`${DONATIONS_INFO}_iac_${APP_VERSION}`);
        }}
      />
      <NewContextButton
        type={'end'}
        icon={{pack: 'community', name: 'book-open-variant'}}
        textString={t('app.changelog.see_full_changelog')}
        style={[localStyles.changelogButton, localStyles.fullChangelogButton]}
        onPress={() => {
          openUrl(CHANGELOG);
        }}
      />
      <NewContextButton
        type={'detatched'}
        icon={{pack: 'regular', name: 'close'}}
        textString={t('app.changelog.dismiss')}
        style={[localStyles.changelogButton, localStyles.closeButton]}
        onPress={() => {
          setState(false);
        }}
      />
    </View>
  );
};

export const ChangelogSheet = ({
  setState,
  isNewlyUpdated,
}: {
  setState: (show: boolean) => void;
  isNewlyUpdated: boolean;
}) => {
  return (
    <View style={localStyles.container}>
      <View style={localStyles.innerContainer}>
        <ChangelogHeader isNewlyUpdated={isNewlyUpdated} />
        <ChangelogButtons setState={setState} />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  container: {
    flex: 1,
    padding: commonValues.sizes.xl,
    paddingBlockStart: commonValues.sizes.xl + rt.insets.top,
    paddingBlockEnd: commonValues.sizes.xl + rt.insets.bottom,
    backgroundColor: currentTheme.backgroundPrimary,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  paragraphsContainer: {
    marginBlockStart: commonValues.sizes.large,
    gap: commonValues.sizes.medium,
  },
  changelogButton: {
    flex: 0,
    justifyContent: 'center',
  },
  fullChangelogButton: {
    backgroundColor: currentTheme.backgroundSecondary,
    marginBlockEnd: commonValues.sizes.xs,
  },
  closeButton: {marginBlockEnd: 0},
}));
