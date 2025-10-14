import type {Channel, Message, Server, User} from 'revolt.js';

import {LOADING_SCREEN_REMARKS} from '@clerotri/lib/consts';
import type {
  CreateChannelModalProps,
  CVChannel,
  DeletableObject,
  MemberWithModAction,
  ReplyingMessage,
  ReportedObject,
  SettingsSection,
  TextEditingModalProps,
} from '@clerotri/lib/types';

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
  openSettings: (o: boolean | SettingsSection) => {
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
  openChannelSwitcher: (state: boolean) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openChannelSwitcher (args: ${state})`,
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
  handleAnalyticsSettingsVisibility: (
    stateFunction: (state: boolean) => void,
  ) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function handleAnalyticsSettingsVisibility (args: ${stateFunction})`,
    );
  },
  closeRoleSubsection: () => {
    console.log(
      '[FUNCTIONS] Tried to run uninitialised function closeRoleSubsection',
    );
  },
  openAnalyticsMenu: (state: boolean, blockClosing?: boolean) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openAnalyticsMenu (args: ${state}, ${blockClosing})`,
    );
  },
  openChangelog: (state: boolean) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openChangelog (args: ${state})`,
    );
  },
  openModActionModal: (member: MemberWithModAction | null) => {
    console.log(
      `[FUNCTIONS] Tried to run uninitialised function openModActionModal (args: ${member})`,
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
