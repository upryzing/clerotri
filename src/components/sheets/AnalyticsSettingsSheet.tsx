import {useCallback, useContext, useRef, useState} from 'react';
import {
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {useMMKVString} from 'react-native-mmkv';
import {
  type EdgeInsets,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {app, setFunction} from '@clerotri/Generic';
import {
  BackButton,
  Button,
  Link,
  Text,
} from '@clerotri/components/common/atoms';
import {generateAnalyticsObject} from '@clerotri/lib/analytics';
import {PRIVACY_INFO} from '@clerotri/lib/consts';
import {commonValues, type Theme, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

const LevelBoxEntry = ({
  dataType,
  value,
}: {
  dataType: string;
  value: string;
}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const iconFromType = useCallback((type: string) => {
    switch (type) {
      case 'model':
        return 'phone-android';
      case 'os':
        return 'perm-device-info';
      case 'inBasic':
        return 'info';
      case 'settings':
        return 'settings';
      case 'instance':
        return 'link';
      default:
        return 'question-mark';
    }
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBlock: commonValues.sizes.small,
      }}>
      {dataType === 'clerotriVersion' ? (
        <MaterialCommunityIcon
          name={'flower'}
          color={currentTheme.foregroundPrimary}
          size={24}
        />
      ) : (
        <MaterialIcon
          name={iconFromType(dataType)}
          color={currentTheme.foregroundPrimary}
          size={24}
        />
      )}
      <View style={{marginInlineStart: commonValues.sizes.medium}}>
        <Text style={{fontWeight: 'bold'}}>
          {t(`app.analytics.values.${dataType}`)}
        </Text>
        <Text colour={currentTheme.foregroundSecondary}>{value}</Text>
      </View>
    </View>
  );
};

const TierButton = ({
  tier,
  closeOnSelection,
}: {
  tier: 'basic' | 'full';
  closeOnSelection: boolean;
}) => {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateTierButtonStyles(currentTheme);

  const {t} = useTranslation();

  const [analyticsLevel, setAnalyticsLevel] =
    useMMKVString('app.analyticsLevel');

  return analyticsLevel === tier ? (
    <View style={localStyles.activeContainer}>
      <MaterialIcon name={'check'} color={currentTheme.accentColor} size={24} />
      <Text style={localStyles.activeText}>{t('app.analytics.active')}</Text>
    </View>
  ) : (
    <Button
      onPress={() => {
        setAnalyticsLevel(tier);
        closeOnSelection && app.openAnalyticsMenu(false);
      }}
      style={{margin: 0}}
      backgroundColor={currentTheme.backgroundPrimary}>
      <Text style={localStyles.tierButtonLabel}>
        {t(
          `app.analytics.${!analyticsLevel || analyticsLevel === 'none' ? `enable_${tier}` : `switch_to_${tier}`}`,
        )}
      </Text>
    </Button>
  );
};

const LevelBoxes = observer(
  ({closeOnSelection}: {closeOnSelection: boolean}) => {
    const {width} = useWindowDimensions();

    const {currentTheme} = useContext(ThemeContext);
    const localStyles = generateLevelBoxStyles(currentTheme, width);

    const {t} = useTranslation();

    const [analyticsLevel, setAnalyticsLevel] =
      useMMKVString('app.analyticsLevel');

    const scrollViewRef = useRef<ScrollView>(null);

    const [scrollPosition, setScrollPosition] = useState<
      'start' | 'mid' | 'end'
    >('start');

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const position = e.nativeEvent.contentOffset.x;
      const viewWidth =
        e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width;

      if (position <= 0) {
        setScrollPosition('start');
      } else if (position >= viewWidth) {
        setScrollPosition('end');
      } else {
        setScrollPosition('mid');
      }
      // console.log(
      //   e.nativeEvent.contentOffset.x,
      //   e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width,
      // );
    };

    const data = generateAnalyticsObject('full');

    const settingsLength = data.settings
      ? Object.entries(data.settings).length
      : 0;

    return (
      <>
        <ScrollView
          ref={scrollViewRef}
          onScroll={onScroll}
          style={{
            marginBlockStart: commonValues.sizes.xl,
            marginBlockEnd: commonValues.sizes.medium,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View style={[localStyles.levelBox, localStyles.basicBox]}>
            <View style={localStyles.levelBoxInfo}>
              <View style={localStyles.levelBoxHeader}>
                <Text type={'h1'}>{t('app.analytics.tiers.basic')}</Text>
                <Pressable
                  onPress={() => {
                    Clipboard.setString(
                      JSON.stringify(generateAnalyticsObject('basic')),
                    );
                    showToast(t('app.analytics.copied_data_toast'));
                  }}>
                  <MaterialIcon
                    name={'content-copy'}
                    color={currentTheme.foregroundPrimary}
                    size={20}
                  />
                </Pressable>
              </View>
              <LevelBoxEntry dataType={'model'} value={data.model} />
              <LevelBoxEntry dataType={'os'} value={data.os} />
              <LevelBoxEntry
                dataType={'clerotriVersion'}
                value={data.version}
              />
            </View>
            <TierButton tier={'basic'} closeOnSelection={closeOnSelection} />
          </View>
          <View style={[localStyles.levelBox, localStyles.fullBox]}>
            <View style={localStyles.levelBoxInfo}>
              <View style={localStyles.levelBoxHeader}>
                <Text type={'h1'}>{t('app.analytics.tiers.full')}</Text>
                <Pressable
                  onPress={() => {
                    Clipboard.setString(
                      JSON.stringify(generateAnalyticsObject('full')),
                    );
                    showToast(t('app.analytics.copied_data_toast'));
                  }}>
                  <MaterialIcon
                    name={'content-copy'}
                    color={currentTheme.foregroundPrimary}
                    size={20}
                  />
                </Pressable>
              </View>
              <LevelBoxEntry
                dataType={'inBasic'}
                value={t('app.analytics.values.inBasic_body')}
              />
              <LevelBoxEntry
                dataType={'settings'}
                value={t('app.analytics.values.settings_body', {
                  count: settingsLength,
                })}
              />
              <LevelBoxEntry dataType={'instance'} value={data.instance!} />
            </View>
            <TierButton tier={'full'} closeOnSelection={closeOnSelection} />
          </View>
        </ScrollView>
        <Button
          onPress={() => {
            setAnalyticsLevel('none');
            closeOnSelection && app.openAnalyticsMenu(false);
          }}
          style={localStyles.disableAnalyticsButton}
          backgroundColor={currentTheme.backgroundSecondary}>
          <Text
            colour={
              analyticsLevel === 'none'
                ? currentTheme.foregroundSecondary
                : currentTheme.foregroundPrimary
            }>
            {t(
              `app.analytics.${!analyticsLevel ? 'continue_without_analytics' : analyticsLevel === 'none' ? 'analytics_disabled' : 'disable_analytics'}`,
            )}
          </Text>
        </Button>
        {scrollPosition !== 'start' && (
          <Pressable
            onPress={() => scrollViewRef.current?.scrollTo({x: 0})}
            style={[localStyles.scrollButton, localStyles.scrollToStartButton]}>
            <MaterialCommunityIcon
              name={'arrow-left'}
              color={currentTheme.accentColorForeground}
              size={24}
            />
          </Pressable>
        )}
        {scrollPosition !== 'end' && (
          <Pressable
            onPress={() =>
              scrollViewRef.current?.scrollTo({
                x: width - commonValues.sizes.xl - commonValues.sizes.medium,
              })
            }
            style={[localStyles.scrollButton, localStyles.scrollToEndButton]}>
            <MaterialCommunityIcon
              name={'arrow-right'}
              color={currentTheme.accentColorForeground}
              size={24}
            />
          </Pressable>
        )}
      </>
    );
  },
);

export const AnalyticsSettingsSheet = observer(
  ({blockClosing, setState}: {blockClosing: boolean; setState: Function}) => {
    const insets = useSafeAreaInsets();

    const {currentTheme} = useContext(ThemeContext);
    const localStyles = generateLocalStyles(currentTheme, insets);

    const {t} = useTranslation();

    setFunction(
      'handleAnalyticsSettingsVisibility',
      (setVisibility: (state: boolean) => void) => {
        if (!blockClosing) {
          setVisibility(false);
        }
      },
    );

    return (
      <View style={localStyles.outerContainer}>
        {!blockClosing && (
          <BackButton
            callback={() => {
              setState();
            }}
          />
        )}
        <View style={localStyles.innerContainer}>
          <Text style={localStyles.title}>{t('app.analytics.title')}</Text>
          <Text style={{textAlign: 'center'}}>{t('app.analytics.body')}</Text>
          <Link
            link={PRIVACY_INFO}
            label={t('app.analytics.privacy_info')}
            style={{
              fontWeight: 'bold',
              marginBlockStart: commonValues.sizes.large,
            }}
          />
          <LevelBoxes closeOnSelection={blockClosing} />
        </View>
      </View>
    );
  },
);

const generateTierButtonStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    tierButtonLabel: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    activeContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: commonValues.sizes.large,
    },
    activeText: {
      fontWeight: 'bold',
      fontSize: 18,
      color: currentTheme.accentColor,
      paddingInlineStart: commonValues.sizes.small,
    },
  });
};

const generateLevelBoxStyles = (currentTheme: Theme, screenWidth: number) => {
  return StyleSheet.create({
    levelBox: {
      borderRadius: commonValues.sizes.medium,
      padding: commonValues.sizes.xl,
      backgroundColor: currentTheme.headerBackground,
      width: screenWidth - commonValues.sizes.xl * 4,
      maxWidth: 600,
    },
    basicBox: {
      marginInlineEnd: commonValues.sizes.small,
    },
    fullBox: {
      marginInlineStart: commonValues.sizes.small,
    },
    levelBoxHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    levelBoxInfo: {
      flex: 1,
    },
    tierButtonLabel: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    disableAnalyticsButton: {
      width: '100%',
      margin: 0,
      marginBlockEnd: commonValues.sizes.xl,
      backgroundColor: currentTheme.buttonBackground,
    },
    activeContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: commonValues.sizes.large,
    },
    activeText: {
      fontWeight: 'bold',
      fontSize: 18,
      color: currentTheme.accentColor,
      paddingInlineStart: commonValues.sizes.small,
    },
    scrollButton: {
      position: 'absolute',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.accentColor,
      padding: commonValues.sizes.large,
      borderRadius: commonValues.sizes.medium,
    },
    scrollToStartButton: {
      left: commonValues.sizes.xl,
    },
    scrollToEndButton: {
      right: commonValues.sizes.xl,
    },
  });
};

const generateLocalStyles = (currentTheme: Theme, insets: EdgeInsets) => {
  return StyleSheet.create({
    outerContainer: {
      flex: 1,
      padding: commonValues.sizes.xl,
      paddingBlockStart: commonValues.sizes.xl + insets.top,
      paddingBlockEnd: commonValues.sizes.xl + insets.bottom,
      backgroundColor: currentTheme.backgroundPrimary,
    },
    innerContainer: {
      flex: 1,
      marginBlockStart: commonValues.sizes.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 24,
      marginBlockEnd: commonValues.sizes.medium,
    },
  });
};
