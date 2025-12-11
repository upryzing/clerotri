import type {ColorValue, TextProps, TouchableOpacityProps} from 'react-native';

import type {MaterialDesignIconsIconName} from '@react-native-vector-icons/material-design-icons';
import type {MaterialIconsIconName} from '@react-native-vector-icons/material-icons';

import type {Channel, Member, Message, Server, User} from 'revolt.js';

import {Theme} from '@clerotri/lib/themes';

type StringSetting = {
  default: string;
  type: 'string' | 'number';
  value?: string;
};

type BoolSetting = {
  default: boolean;
  type: 'boolean';
  value?: boolean;
};

export type Setting = (StringSetting | BoolSetting) & {
  key: string;
  category: string;
  experimental?: boolean;
  developer?: boolean;
  deprecated?: boolean;
  options?: string[];
  checkBeforeChanging?: (value: any) => Promise<boolean>;
  onChange?: any;
  onInitialize?: any;
  remark?: boolean;
};

export type SettingsSection = {
  section: string;
  subsection?: string;
} | null;

export type ReplyingMessage = {
  mentions: boolean;
  message: Message;
};

interface TypedChannel {
  type: 'Channel';
  object: Channel;
}

interface TypedRole {
  type: 'Role';
  object: {
    role: string; // role ID
    server: Server;
  };
}

interface TypedMessage {
  type: 'Message';
  object: Message;
}

interface TypedServer {
  type: 'Server';
  object: Server;
}

interface TypedUser {
  type: 'User';
  object: User;
}

export type ReportedObject = TypedMessage | TypedServer | TypedUser;

export type DeletableObject =
  | TypedChannel
  | TypedRole
  | TypedMessage
  | TypedServer;

export type MemberWithModAction = {
  member: Member;
  action: 'kick' | 'ban';
  callback: (s: string) => void;
};

type ThemeColour = keyof Omit<Theme, 'generalBorderWidth'>;

export type ButtonProps = TouchableOpacityProps & {
  backgroundColor?: string;
};

export type IconType =
  | {
      name: MaterialIconsIconName;
      pack: 'regular';
    }
  | {
      name: MaterialDesignIconsIconName;
      pack: 'community';
    };

export type ContextButtonProps = ButtonProps & {
  type?: 'start' | 'end' | 'detatched';
  icon?: IconType & {colour?: ThemeColour; customColour?: ColorValue};
  textString?: string;
  textColour?: ColorValue;
};

export type TextEditingModalProps = {
  initialString: string;
  id: string;
  callback: (s: string) => void;
};

export type CreateChannelModalProps = {
  server: Server;
  category?: string;
  callback: (c: string) => void;
};

export type Language = {
  name: string;
  englishName: string;
  emoji: string;
};

export type MessageProps = {
  message: Message;
  grouped: boolean;
  groupedAfter?: boolean;
  noTopMargin?: boolean;
  queued?: boolean;
  onUserPress?: any;
  onUsernamePress?: any;
  onPress?: any;
  onLongPress?: any;
};

// <from src=https://github.com/Revolt-Unofficial-Clients/revkit/blob/0af5ab5fea68eba89661685be4fe8a60ca72f90a/core/src/utils/Emojis.ts>
export type EmojiPacks = 'mutant' | 'twemoji' | 'noto' | 'openmoji';
// </from>

export type SpecialChannel = 'friends' | 'discover' | 'debug' | null;

export type CVChannel = Channel | SpecialChannel;

type IconProps = TextProps & {
  color?: ThemeColour;
  customColor?: ColorValue;
  size?: number;
};

export type MaterialIconProps = IconProps & {
  name: MaterialIconsIconName;
};

export type MaterialCommunityIconProps = IconProps & {
  name: MaterialDesignIconsIconName;
};
