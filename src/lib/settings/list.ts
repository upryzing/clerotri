import {setLanguage} from '@clerotri-i18n/setLanguage';
import {languages} from '@clerotri-i18n/languages';
import {app} from '@clerotri/Generic';
import {checkNotificationPerms} from '@clerotri/lib/notifications/permissions';
import {themes} from '@clerotri/lib/themes';
import type {Setting, SettingsCategory} from '@clerotri/lib/types';

export const settingsList = [
  {
    key: 'app.language',
    category: 'i18n',
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
    category: 'appearance',
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
    category: 'appearance',
    default: false,
    type: 'boolean',
    developer: true,
  },
  {
    key: 'ui.messaging.statusInChatAvatars',
    category: 'appearance',
    default: false,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.use24H',
    category: 'appearance',
    default: true,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.showMasqAvatar',
    category: 'appearance',
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
    category: 'appearance',
    default: 10,
    type: 'number',
  },
  {
    key: 'ui.messaging.fontSize',
    category: 'appearance',
    remark: true,
    default: 14,
    type: 'number',
  },
  {
    key: 'ui.home.holidays',
    category: 'appearance',
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
    category: 'appearance',
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
    theme: {type: 'settingsButton', props: {}},
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
};

export type CategoryName = keyof typeof settingsCategories;
