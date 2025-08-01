import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Pressable, View} from 'react-native';
import {Trans, useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import type {API, User} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {styles} from '@clerotri/Theme';
import {
  Avatar,
  BackButton,
  Button,
  Checkbox,
  Link,
  Text,
} from '@clerotri/components/common/atoms';
import {ExpandableProfile} from '@clerotri/components/common/profile';
import {
  PressableSettingsEntry,
  SettingsEntry,
} from '@clerotri/components/common/settings/atoms';
import {OFFICIAL_INSTANCE_API_URLS} from '@clerotri/lib/consts';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import type {SettingsSection} from '@clerotri/lib/types';

type GroupedBotObject = {
  user: User;
  bot: API.Bot;
};

const BotSettings = observer(({bot}: {bot: GroupedBotObject}) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const [showToken, setShowToken] = useState(false);
  const [isPublic, setIsPublic] = useState(bot.bot.public);

  return (
    <>
      <ExpandableProfile user={bot.user} />
      <SettingsEntry style={{marginBlockStart: commonValues.sizes.medium}}>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: 'bold'}}>
            {t('app.settings_menu.bots.token')}
          </Text>
          <Text>{showToken ? bot.bot.token : '•••••••••••••••••••••••••'}</Text>
        </View>
        <Pressable
          style={{
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setShowToken(state => !state);
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name={showToken ? 'visibility-off' : 'visibility'}
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </View>
        </Pressable>
        <Pressable
          style={{
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            Clipboard.setString(bot.bot.token);
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name="content-copy"
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </View>
        </Pressable>
      </SettingsEntry>
      <SettingsEntry style={{backgroundColor: currentTheme.backgroundPrimary}}>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: 'bold'}}>
            {t('app.settings_menu.bots.public')}
          </Text>
          <Text>
            {t(
              `app.settings_menu.bots.public_body_${client.apiURL === OFFICIAL_INSTANCE_API_URLS.upryzing ? 'upryzing' : 'revolt'}`,
            )}
          </Text>
        </View>
        <Checkbox
          value={isPublic}
          callback={async () => {
            await client.api.patch(`/bots/${bot.bot._id}`, {
              public: !isPublic,
            });
            setIsPublic(publicState => !publicState);
          }}
        />
      </SettingsEntry>
      <Button onPress={() => Clipboard.setString(`${client.configuration?.app}/bot/${bot.bot._id}`)} style={{margin: 0, marginBlock: commonValues.sizes.small}}>
        <Text>{t('app.settings_menu.bots.copy_invite_link')}</Text>
      </Button>
      <Button onPress={() => app.openBotInvite(bot.bot._id)} style={{margin: 0, marginBlock: commonValues.sizes.small}}>
        <Text>{t('app.settings_menu.bots.invite_bot')}</Text>
      </Button>
    </>
  );
});

const BotListEntry = observer(
  ({
    bot,
    onPress,
  }: {
    bot: GroupedBotObject;
    onPress: (b: GroupedBotObject) => void;
  }) => {
    const {currentTheme} = useContext(ThemeContext);

    return (
      <PressableSettingsEntry onPress={() => onPress(bot)}>
        <MaterialIcon
          name={bot.bot.public ? 'public' : 'lock'}
          size={20}
          color={currentTheme.foregroundPrimary}
          style={{marginInlineEnd: commonValues.sizes.medium}}
        />
        <Avatar user={bot.user} />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginInlineStart: commonValues.sizes.medium,
          }}>
          <Text style={{fontWeight: 'bold'}}>
            {bot.user.username}
            <Text colour={currentTheme.foregroundSecondary}>
              #{bot.user.discriminator}
            </Text>
          </Text>
          <Text colour={currentTheme.foregroundSecondary}>{bot.bot._id}</Text>
        </View>
        <View
          style={{
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name="arrow-forward"
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </View>
        </View>
      </PressableSettingsEntry>
    );
  },
);

// TODO: de-hardcode these when they can be fetched from the backend
const MAX_BOT_COUNT = 5;

const AUP_URL = 'https://revolt.chat/aup';

export const BotList = observer(
  ({
    bots,
    setSection,
    setCurrentBot,
    rerender,
  }: {
    bots: GroupedBotObject[] | null;
    setSection: Function;
    setCurrentBot: Function;
    rerender: Dispatch<SetStateAction<number>>;
  }) => {
    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    return (
      <>
        {bots ? (
          <>
            {bots.length ? (
              <>
                {bots.length < MAX_BOT_COUNT && (
                  <PressableSettingsEntry
                    onPress={() => {
                      app.openTextEditModal({
                        initialString: '',
                        id: 'new_bot',
                        callback: async s => {
                          await client.api.post('/bots/create', {
                            name: s,
                          });
                          rerender(renders => renders + 1);
                        },
                      });
                    }}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={{fontWeight: 'bold'}}>
                        {t('app.settings_menu.bots.new_bot')}
                      </Text>
                      <Text>
                        {t('app.settings_menu.bots.new_bot_body', {
                          limit: MAX_BOT_COUNT,
                        })}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 30,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View style={styles.iconContainer}>
                        <MaterialIcon
                          name="arrow-forward"
                          size={20}
                          color={currentTheme.foregroundPrimary}
                        />
                      </View>
                    </View>
                  </PressableSettingsEntry>
                )}
                <Trans t={t} i18nKey={'app.settings_menu.bots.aup_notice'}>
                  All bots must follow the{' '}
                  <Link link={AUP_URL} label={''}>
                    Acceptable Use Policy
                  </Link>
                  .
                </Trans>
                <View
                  style={{
                    marginBlock: commonValues.sizes.medium,
                    marginInline: commonValues.sizes.medium,
                    height: commonValues.sizes.xs,
                    borderRadius: commonValues.sizes.medium,
                    backgroundColor: currentTheme.backgroundTertiary,
                  }}
                />
                {bots.map(b => (
                  <BotListEntry
                    key={`bot-${b.bot._id}`}
                    bot={b}
                    onPress={() => {
                      setCurrentBot(b);
                      setSection({section: 'bots', subsection: b.bot._id});
                    }}
                  />
                ))}
              </>
            ) : (
              <Text>{t('app.settings_menu.bots.no_bots')}</Text>
            )}
          </>
        ) : (
          <View style={styles.loadingScreen}>
            <Text type={'h1'}>{t('app.settings_menu.bots.loading')}</Text>
          </View>
        )}
      </>
    );
  },
);

export const BotSettingsSection = observer(
  ({section, setSection}: {section: SettingsSection; setSection: Function}) => {
    const {t} = useTranslation();

    const [bots, setBots] = useState<GroupedBotObject[] | null>(null);

    const [currentBot, setCurrentBot] = useState<GroupedBotObject | null>(null);

    const [renderCount, rerender] = useState(0);

    useEffect(() => {
      async function getBots() {
        const b = await client.bots.fetchOwned();
        const groupedBots = [];

        for (const user of b.users) {
          const botObject = b.bots.find(bot => bot._id === user._id)!;
          groupedBots.push({user, bot: botObject});
        }

        setBots(groupedBots);
      }
      getBots();
    }, [renderCount]);

    const handleBackInSubsection = () => {
      setCurrentBot(null);
      setSection({section: 'bots', subsection: undefined});
    };

    return (
      <>
        <BackButton
          callback={() => {
            currentBot ? handleBackInSubsection() : setSection(null);
          }}
          margin
        />
        <Text type={'h1'}>{t(`app.settings_menu.bots.title`)}</Text>
        {section!.subsection !== undefined && currentBot ? (
          <BotSettings bot={currentBot} />
        ) : (
          <BotList
            bots={bots}
            setSection={setSection}
            setCurrentBot={setCurrentBot}
            rerender={rerender}
          />
        )}
      </>
    );
  },
);
