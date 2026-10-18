import {setLanguage} from '@clerotri-i18n/setLanguage';
import {languages} from '@clerotri-i18n/languages';
import {app} from '@clerotri/Generic';
import {checkNotificationPerms} from '@clerotri/lib/notifications/permissions';
import {
  CLEROTRI_EMAIL,
  OPEN_ISSUES,
  PRIVACY_INFO,
  SPECIAL_SERVERS,
} from '@clerotri/lib/consts';
import {APP_VERSION} from '@clerotri/lib/metadata';
import {themes} from '@clerotri/lib/themes';
import type {Setting, SettingsCategory} from '@clerotri/lib/types';

export const settingsList: Record<string, Setting> = {
  'app.language': {
    default: 'en',
    type: 'string',
    options: Object.keys(languages),
    onChange: (v: string) => {
      setLanguage(v);
    },
  },
  'ui.theme': {
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
  'ui.messaging.showSelfInTypingIndicator': {
    default: false,
    type: 'boolean',
    developer: true,
  },
  'ui.messaging.statusInChatAvatars': {
    default: false,
    type: 'boolean',
  },
  'ui.messaging.use24H': {
    default: true,
    type: 'boolean',
  },
  'ui.messaging.showMasqAvatar': {
    default: true,
    type: 'boolean',
  },
  'app.refetchOnReconnect': {
    default: true,
    type: 'boolean',
    experimental: true,
  },
  'app.reopenLastChannel': {
    default: true,
    type: 'boolean',
  },
  'app.notifications.enabled': {
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
  'app.notifications.enabledInApp': {
    default: true,
    type: 'boolean',
  },
  'app.notifications.notifyOnSelfPing': {
    default: false,
    type: 'boolean',
    developer: true,
  },
  'ui.messaging.messageSpacing': {
    default: 10,
    type: 'number',
  },
  'ui.messaging.fontSize': {
    remark: true,
    default: 14,
    type: 'number',
  },
  'ui.home.holidays': {
    default: true,
    type: 'boolean',
  },
  'ui.messaging.hideBlockedMessages': {
    default: false,
    type: 'boolean',
  },
  'ui.messaging.doubleTapToReply': {
    default: true,
    type: 'boolean',
    experimental: true,
    remark: true,
  },
  'ui.messaging.emojiPack': {
    default: 'System',
    type: 'string',
    options: ['System', 'Mutant', 'Twemoji', 'Noto', 'Openmoji'],
  },
  'ui.messaging.showNSFWContent': {
    default: false,
    type: 'boolean',
  },
  'ui.messaging.sendAttachments': {
    default: true,
    type: 'boolean',
  },
  'ui.messaging.showReactions': {
    remark: true,
    default: false,
    type: 'boolean',
    experimental: true,
  },
  'ui.messaging.experimentalScrolling': {
    remark: true,
    default: false,
    type: 'boolean',
    experimental: true,
    deprecated: true,
  },
  'ui.messaging.useNewMessageView': {
    default: true,
    type: 'boolean',
    experimental: true,
    deprecated: true,
  },
  'app.showChangelogs': {
    default: true,
    type: 'boolean',
  },
  'ui.settings.showExperimental': {
    default: false,
    type: 'boolean',
  },
  'ui.showDeveloperFeatures': {
    default: false,
    type: 'boolean',
  },
};

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
    detatchedTheme: ['ui.theme'],
    themes: {
      type: 'settingsButton',
      props: {
        title: 'app.settings_menu.appearance.themes.title',
        body: 'app.settings_menu.appearance.themes.body',
        onPress: ({setSection}) => {
          setSection({section: 'appearance', subsection: 'themes'});
        },
      },
    },
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
  feedback: {
    serverLink: {
      type: 'settingsButton',
      props: {
        title: 'app.settings_menu.feedback.server.title',
        body: 'app.settings_menu.feedback.server.body',
        onPress: ({openLink}) => {
          openLink(`https://stt.gg/${SPECIAL_SERVERS.supportServer.invite}`);
        },
      },
    },
    emailLink: {
      type: 'settingsButton',
      props: {
        title: 'app.settings_menu.feedback.email.title',
        body: 'app.settings_menu.feedback.email.body',
        onPress: ({openLink}) => {
          openLink(
            `${CLEROTRI_EMAIL}?subject=[FEEDBACK]&body=\n\nApp version: v${APP_VERSION}`,
          );
        },
      },
    },
    githubLink: {
      type: 'settingsButton',
      props: {
        title: 'app.settings_menu.feedback.github.title',
        body: 'app.settings_menu.feedback.github.body',
        onPress: ({openLink}) => {
          openLink(OPEN_ISSUES);
        },
      },
    },
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
    analytics: {
      type: 'settingsButton',
      props: {
        title: 'app.settings_menu.privacy.analytics.title',
        body: 'app.settings_menu.privacy.analytics.body',
        onPress: () => {
          app.openAnalyticsMenu(true);
        },
      },
    },
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
