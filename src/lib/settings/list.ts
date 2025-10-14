import {setLanguage} from '@clerotri-i18n/i18n';
import {languages} from '@clerotri-i18n/languages';
import {app} from '@clerotri/Generic';
import {checkNotificationPerms} from '@clerotri/lib/notifications/permissions';
import {themes} from '@clerotri/lib/themes';
import type {Setting} from '@clerotri/lib/types';

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
    category: 'functionality',
    default: true,
    type: 'boolean',
  },
  {
    key: 'app.reopenLastChannel',
    category: 'functionality',
    default: true,
    type: 'boolean',
  },
  {
    key: 'app.notifications.enabled',
    category: 'functionality',
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
    category: 'functionality',
    default: true,
    type: 'boolean',
  },
  {
    key: 'app.notifications.notifyOnSelfPing',
    category: 'functionality',
    default: false,
    type: 'boolean',
    developer: true,
  },
  {
    key: 'ui.messaging.messageSpacing',
    category: 'appearance',
    default: '10',
    type: 'number',
  },
  {
    key: 'ui.messaging.fontSize',
    category: 'appearance',
    remark: true,
    default: '14',
    type: 'number',
  },
  {
    key: 'ui.home.holidays',
    category: 'appearance',
    default: true,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.doubleTapToReply',
    category: 'functionality',
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
    category: 'functionality',
    default: false,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.sendAttachments',
    category: 'functionality',
    default: true,
    type: 'boolean',
  },
  {
    key: 'ui.messaging.showReactions',
    category: 'functionality',
    remark: true,
    default: false,
    type: 'boolean',
    experimental: true,
  },
  {
    key: 'ui.messaging.experimentalScrolling',
    category: 'functionality',
    remark: true,
    default: false,
    type: 'boolean',
    experimental: true,
    deprecated: true,
  },
  {
    key: 'ui.messaging.useNewMessageView',
    category: 'functionality',
    default: true,
    type: 'boolean',
    experimental: true,
    deprecated: true,
  },
  {
    key: 'app.showChangelogs',
    category: 'functionality',
    default: true,
    type: 'boolean',
  },
  {
    key: 'ui.settings.showExperimental',
    category: 'functionality',
    default: false,
    type: 'boolean',
  },
  {
    key: 'ui.showDeveloperFeatures',
    category: 'functionality',
    default: false,
    type: 'boolean',
  },
] as Setting[];
