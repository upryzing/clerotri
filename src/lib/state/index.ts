import {createContext} from 'react';

import type {Server} from 'revolt.js';

import {CVChannel} from '@clerotri/lib/types';

export const ChannelContext = createContext<{
  currentChannel: CVChannel;
  setCurrentChannel: (channel: CVChannel) => void;
}>({currentChannel: null, setCurrentChannel: () => {}});

export const ServerContext = createContext<{
  currentServer: Server | null;
  setCurrentServer: (server: Server | null) => void;
}>({currentServer: null, setCurrentServer: () => {}});

export const OrderedServersContext = createContext<{
  orderedServers: string[];
  setOrderedServers: (servers: string[]) => void;
}>({orderedServers: [], setOrderedServers: () => {}});

export const SideMenuContext = createContext<{
  sideMenuOpen: boolean;
  setSideMenuOpen: (open: boolean) => void;
}>({sideMenuOpen: false, setSideMenuOpen: () => {}});
