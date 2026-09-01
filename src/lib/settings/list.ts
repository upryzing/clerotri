import {setLanguage} from '@clerotri-i18n/setLanguage';
import {languages} from '@clerotri-i18n/languages';
import {app} from '@clerotri/Generic';
import {checkNotificationPerms} from '@clerotri/lib/notifications/permissions';
import {PRIVACY_INFO} from '@clerotri/lib/consts';
import {themes} from '@clerotri/lib/themes';
import type {Setting, SettingsCategory} from '@clerotri/lib/types';

export const settingsList = [
  {
    key: 'app.language',
    category: 'MIGRATED',
    default: 'en',
    type: 'string',
    options: Object.keys(languages),
    onChange: (v: string) => {
      setLanguage(v);
    },
    onInitialize: (v: string) => {
      setLanguage(v);
    },
  },
  {
    key: 'ui.theme',
    category: 'MIGRATED',
    default: 'Dark',
    type: 'string',
    options: Object.keys(themes),
    onChange: (v: any) => {
      app.setTheme(v);
    },
    onInitialize: (v: any) => {
      app.setTheme(v);
    },
  },
  {
    key: 'ui.messaging.showSelfInTypingIndicator',
    category: 'MIGRATED',
    default: false,
    type: 'boolean',
    developer: true,
  },
  {
    key: 'ui.messaging.statusInChatAvatars',
    category: 'MIGRATED',
    default: false,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.use24H',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.showMasqAvatar',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
  },
  {
    key: 'app.refetchOnReconnect',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
    experimental: true,
  },
  {
    key: 'app.reopenLastChannel',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
  },
  {
    key: 'app.notifications.enabled',
    category: 'MIGRATED',
    default: false,
    type: 'boolean',
    experimental: true,
    checkBeforeChanging: async (v: boolean) => {
      if (v) {
        const result = await checkNotificationPerms();
        return result === 'granted';
      } else {
        return true;
      }
    },
  },
  {
    key: 'app.notifications.enabledInApp',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
  },
  {
    key: 'app.notifications.notifyOnSelfPing',
    category: 'MIGRATED',
    default: false,
    type: 'boolean',
    developer: true,
  },
  {
    key: 'ui.messaging.messageSpacing',
    category: 'MIGRATED',
    default: 10,
    type: 'number',
  },
  {
    key: 'ui.messaging.fontSize',
    category: 'MIGRATED',
    remark: true,
    default: 14,
    type: 'number',
  },
  {
    key: 'ui.home.holidays',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.hideBlockedMessages',
    category: 'MIGRATED',
    default: false,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.doubleTapToReply',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
    experimental: true,
    remark: true,
  },
  {
    key: 'ui.messaging.emojiPack',
    category: 'MIGRATED',
    default: 'System',
    type: 'string',
    options: ['System', 'Mutant', 'Twemoji', 'Noto', 'Openmoji'],
  },
  {
    key: 'ui.messaging.showNSFWContent',
    category: 'MIGRATED',
    default: false,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.sendAttachments',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.showReactions',
    category: 'MIGRATED',
    remark: true,
    default: false,
    type: 'boolean',
    experimental: true,
  },
  {
    key: 'ui.messaging.experimentalScrolling',
    category: 'MIGRATED',
    remark: true,
    default: false,
    type: 'boolean',
    experimental: true,
    deprecated: true,
  },
  {
    key: 'ui.messaging.useNewMessageView',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
    experimental: true,
    deprecated: true,
  },
  {
    key: 'app.showChangelogs',
    category: 'MIGRATED',
    default: true,
    type: 'boolean',
  },
  {
    key: 'ui.settings.showExperimental',
    category: 'MIGRATED',
    default: false,
    type: 'boolean',
  },
  {
    key: 'ui.showDeveloperFeatures',
    category: 'MIGRATED',
    default: false,
    type: 'boolean',
  },
] as Setting[];

// const category = {
//   group: [''],
//   item: {type: 'button', /*xyz props */},
//   group2: [],
//   item2: {type: 'divider'},
//   /* something for text? */
// }

// start an item's name with `detatched` to hide the group label
export const settingsCategories: Record<string, SettingsCategory> = {
  appearance: {
    detatchedTheme: ['ui.theme'], //{
    // type: 'settingsButton',
    // props: {
    //   title: 'app.settings_menu.appearance.theme.title',
    //   body: 'app.settings_menu.appearance.theme.body',
    //   onPress: ({setSection}) => {
    //     setSection({section: 'appearance', subsection: 'themes'});
    //   },
    // },
    //},
    messaging: [
      'ui.messaging.messageSpacing',
      'ui.messaging.use24H',
      'ui.messaging.statusInChatAvatars',
      'ui.messaging.showMasqAvatar',
      'ui.messaging.showSelfInTypingIndicator',
    ],
    font: ['ui.messaging.fontSize'],
    emoji: ['ui.messaging.emojiPack'],
    detatchedHome: ['ui.home.holidays'],
  },
  functionality: {
    notifications: [
      'app.notifications.enabled',
      'app.notifications.enabledInApp',
      'app.notifications.notifyOnSelfPing',
    ],
    detatchedNSFW: ['ui.messaging.showNSFWContent'],
    messaging: [
      'ui.messaging.doubleTapToReply',
      'ui.messaging.hideBlockedMessages',
      'ui.messaging.showReactions',
      'ui.messaging.sendAttachments',
      'app.refetchOnReconnect',
    ],
    detatchedReopen: ['app.reopenLastChannel'],
    detatchedChangelogs: ['app.showChangelogs'],
    advanced: ['ui.settings.showExperimental', 'ui.showDeveloperFeatures'],
    detatchedNMV: [
      'ui.messaging.useNewMessageView',
      'ui.messaging.experimentalScrolling',
    ],
  },
  i18n: {
    detatchedi18n: ['app.language'],
  },
  privacy: {
    badges: ['app.refetchOnReconnect'], //placeholder
    divider: {type: 'divider'},
    infoLink: {
      type: 'settingsButton',
      props: {
        title: 'app.settings_menu.privacy.info.title',
        body: 'app.settings_menu.privacy.info.body',
        onPress: ({openLink}) => {
          openLink(PRIVACY_INFO);
        },
      },
    },
  },
};

export type CategoryName = keyof typeof settingsCategories;
