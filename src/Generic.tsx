import type {Channel, Message, Server, User} from 'revolt.js';

import {setLanguage} from '@clerotri-i18n/i18n';
import {languages} from '@clerotri-i18n/languages';
import {LOADING_SCREEN_REMARKS} from '@clerotri/lib/consts';
import {checkNotificationPerms} from '@clerotri/lib/notifications/permissions';
import {storage} from '@clerotri/lib/storage';
import {themes} from '@clerotri/lib/themes';
import {
  CreateChannelModalProps,
  CVChannel,
  DeletableObject,
  ReplyingMessage,
  ReportedObject,
  Setting,
  TextEditingModalProps,
} from '@clerotri/lib/types';

export const appVersion = '0.9.1';

export const settings = {
  _fetch: (k: string) => {
    let s;
    for (const setting of settings.list) {
      if (setting.key === k) {
        s = setting;
      }
    }
    if (!s) {
      console.log(`[SETTINGS] Setting ${k} does not exist; func = _fetch`);
      return null;
    }
    return s as Setting;
  },
  getRaw: (k: string) => {
    const setting = settings._fetch(k);
    if (!setting) {
      console.log(`[SETTINGS] Setting ${k} does not exist; func = getRaw`);
      return null;
    }
    return setting.value !== undefined ? setting.value : setting.default;
  },
  get: (k: string) => {
    const setting = settings._fetch(k);
    if (!setting) {
      console.warn(`[SETTINGS] Setting ${k} does not exist; func = get`);
      return null;
    }
    let raw =
      setting.value !== undefined &&
      (setting.experimental
        ? settings._fetch('ui.settings.showExperimental')?.value
        : true) &&
      (setting.developer
        ? settings._fetch('ui.showDeveloperFeatures')?.value
        : true)
        ? setting.value
        : setting.default;
    const toreturn =
      setting.type === 'number' ? parseInt(raw as string, 10) || 0 : raw;
    return toreturn;
  },
  set: (k: string, v: string | boolean | undefined) => {
    try {
      const setting = settings._fetch(k);
      if (!setting) {
        console.warn(`[SETTINGS] Setting ${k} does not exist; func = set`);
        return null;
      }
      setting.value = v;
      setting.onChange && setting.onChange(v);
      settings.save();
    } catch (err) {
      console.log(`[SETTINGS] Error setting setting ${k} to ${v}: ${err}`);
    }
  },
  save: () => {
    try {
      let out: object[] = [];
      for (const s of settings.list) {
        if (s.value !== undefined) {
          out.push({key: s.key, value: s.value});
        }
      }
      storage.set('settings', JSON.stringify(out));
    } catch (err) {
      console.log(`[SETTINGS] Error saving settings: ${err}`);
    }
  },
  clear: () => {
    try {
      storage.set('settings', '[]');
      for (const s of settings.list) {
        delete s.value;
        s.onChange && s.onChange(s.default);
      }
    } catch (err) {
      console.log(`[SETTINGS] Error saving settings: ${err}`);
    }
  },
  list: [
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
  ] as Setting[],
};

export const app = {
  setTheme: (themeName: string) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function setTheme (args: ${themeName})`,
    );
  },
  setLoggedOutScreen: (screen: 'loginPage' | 'loadingPage') => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function setLoggedOutScreen (args: ${screen})`,
    );
  },
  setLoadingStage: (stage: string) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function setLoadingStage (args: ${stage})`,
    );
  },
  openProfile: (u?: User | null, s?: Server | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openProfile (args: ${u}, ${s})`,
    );
  },
  openLeftMenu: (o: boolean) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openLeftMenu (args: ${o})`,
    );
  },
  openInvite: (i: string) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openInvite (args: ${i})`,
    );
  },
  openBotInvite: (i: string) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openBotInvite (args: ${i})`,
    );
  },
  openServer: (s?: Server) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openServer (args: ${s})`,
    );
  },
  getCurrentServer: () => {
    return undefined as string | undefined;
  },
  openChannel: (c: CVChannel) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openChannel (args: ${c})`,
    );
  },
  getCurrentChannel: (): CVChannel => {
    return null;
  },
  openDirectMessage: (c: Channel) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openDirectMessage (args: ${c})`,
    );
  },
  openImage: (a: any) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openImage (args: ${a})`,
    );
  },
  openMessage: (m: Message | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openMessage (args: ${m})`,
    );
  },
  openChannelContextMenu: (c: Channel | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openChannelContextMenu (args: ${c})`,
    );
  },
  openServerContextMenu: (s: Server | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openServerContextMenu (args: ${s})`,
    );
  },
  openSettings: (o: boolean) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openSettings (args: ${o})`,
    );
  },
  openServerSettings: (s: Server | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openServerSettings (args: ${s})`,
    );
  },
  setMessageBoxInput: (t: string | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function setMessageBoxInput (args: ${t})`,
    );
  },
  getMessageBoxInput: () => {
    return '';
  },
  setEditingMessage: (message: Message) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function setEditingMessage (args: ${message})`,
    );
  },
  getEditingMessage: (): Message | null => {
    return null;
  },
  setReplyingMessages: (m: ReplyingMessage[]) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function setReplyingMessages (args: ${m})`,
    );
  },
  getReplyingMessages: (): ReplyingMessage[] => {
    return [];
  },
  /**
   * @deprecated Message queuing will be removed/reworked due to the switch of message views
   */
  pushToQueue: (m: any) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised (and deprecated) function pushToQueue (args: ${m})`,
    );
  },
  logOut: () => {},
  openMemberList: (data: Channel | Server | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openMemberList (args: ${data})`,
    );
  },
  openChannelInfoMenu: (c: Channel | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openChannelInfoMenu (args: ${c})`,
    );
  },
  openPinnedMessagesMenu: (c: Channel | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openPinnedMessagesMenu (args: ${c})`,
    );
  },
  openStatusMenu: (state: boolean) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openStatusMenu (args: ${state})`,
    );
  },
  openReportMenu: (object: ReportedObject | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openReportMenu (args: ${object})`,
    );
  },
  openDeletionConfirmationModal: (object: DeletableObject | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openDeletionConfirmationModal (args: ${object})`,
    );
  },
  openTextEditModal: (object: TextEditingModalProps | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openTextEditModal (args: ${object})`,
    );
  },
  openCreateChannelModal: (object: CreateChannelModalProps | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openCreateChannelModal (args: ${object})`,
    );
  },
  openChannelSwitcher: (context: Server | 'home' | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openChannelSwitcher (args: ${context})`,
    );
  },
  openNewInviteModal: (code: string | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openNewInviteModal (args: ${code})`,
    );
  },
  handleSettingsVisibility: (stateFunction: (state: boolean) => void) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function handleSettingsVisibility (args: ${stateFunction})`,
    );
  },
  handleServerSettingsVisibility: (stateFunction: (state: null) => void) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function handleServerSettingsVisibility (args: ${stateFunction})`,
    );
  },
  closeRoleSubsection: () => {
    console.log(
      '[FUNCTIONS] Tried to run uninitialised function closeRoleSubsection',
    );
  },
};

export function setFunction(name: keyof typeof app, func: any) {
  app[name] = func;
}

export var selectedRemark =
  LOADING_SCREEN_REMARKS[
    Math.floor(Math.random() * LOADING_SCREEN_REMARKS.length)
  ];
export function randomizeRemark() {
  selectedRemark =
    LOADING_SCREEN_REMARKS[
      Math.floor(Math.random() * LOADING_SCREEN_REMARKS.length)
    ];
}
