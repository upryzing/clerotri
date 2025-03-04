import {type RefObject, useContext, useEffect, useRef, useState} from 'react';

import type {API, ClientboundNotification} from 'revolt.js';

import {app, randomizeRemark, setFunction, settings} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {Modals} from '@clerotri/Modals';
import {SideMenuHandler} from '@clerotri/SideMenu';
import {NetworkIndicator} from '@clerotri/components/NetworkIndicator';
import {Notification} from '@clerotri/components/Notification';
import {LoadingScreen} from '@clerotri/components/views/LoadingScreen';
import {loginWithSavedToken} from '@clerotri/lib/auth';
import {
  createChannel,
  handleMessageNotification,
  setUpNotifeeListener,
} from '@clerotri/lib/notifications';
import {ChannelContext, OrderedServersContext} from '@clerotri/lib/state';
import {storage} from '@clerotri/lib/storage';
import {ThemeContext} from '@clerotri/lib/themes';
import {CVChannel} from '@clerotri/lib/types';
import {checkLastVersion, openLastChannel} from '@clerotri/lib/utils';
import {LoginViews} from '@clerotri/pages/LoginViews';

function LoggedInViews({
  channelNotificationSettings,
  serverNotificationSettings,
}: {
  channelNotificationSettings: RefObject<any>;
  serverNotificationSettings: RefObject<any>;
}) {
  const [currentChannel, setCurrentChannel] = useState<CVChannel>(null);

  setFunction('openChannel', async (c: CVChannel) => {
    setCurrentChannel(c);
  });

  setFunction('getCurrentChannel', () => {
    return currentChannel;
  });

  const [notificationMessage, setNotificationMessage] =
    useState<API.Message | null>(null);

  useEffect(() => {
    if (settings.get('app.reopenLastChannel')) {
      openLastChannel();
    }
  }, []);

  useEffect(() => {
    if (currentChannel) {
      const lastOpenedChannels = storage.getString('lastOpenedChannels');
      try {
        let parsedData = JSON.parse(lastOpenedChannels || '{}') || {};
        parsedData[
          typeof currentChannel === 'string' || !currentChannel.server
            ? 'DirectMessage'
            : currentChannel.server._id
        ] =
          typeof currentChannel === 'string'
            ? currentChannel
            : currentChannel._id;
        console.log(parsedData);
        storage.set('lastOpenedChannels', JSON.stringify(parsedData));
      } catch (err) {
        console.log(`[APP] Error getting last channel: ${err}`);
      }
    }
  }, [currentChannel]);

  useEffect(() => {
    console.log('[APP] Setting up packet listener...');

    async function onMessagePacket(msg: API.Message) {
      await handleMessageNotification(
        msg,
        channelNotificationSettings.current,
        serverNotificationSettings.current,
        setNotificationMessage,
        'clerotri',
      );
    }

    async function onNewPacket(p: ClientboundNotification) {
      if (p.type === 'Message') {
        await onMessagePacket(p);
      }
    }

    function setUpPacketListener() {
      client.on('packet', onNewPacket);
    }

    function cleanupPacketListener() {
      client.removeListener('packet', onNewPacket);
    }

    try {
      setUpPacketListener();
    } catch (err) {
      console.log(`[LOGGEDINVIEWS] Error setting up global listeners: ${err}`);
    }

    return () => cleanupPacketListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChannelContext.Provider value={{currentChannel, setCurrentChannel}}>
      <SideMenuHandler />
      <Modals />
      <NetworkIndicator client={client} />
      {notificationMessage && (
        <Notification
          message={notificationMessage}
          dismiss={() => setNotificationMessage(null)}
        />
      )}
    </ChannelContext.Provider>
  );
}

export function MainView() {
  const {currentTheme} = useContext(ThemeContext);

  const [status, setStatus] = useState('loggedOut');

  const [orderedServers, setOrderedServers] = useState<string[]>([]);

  const channelNotificationSettings = useRef<any>(undefined);
  const serverNotificationSettings = useRef<any>(undefined);

  useEffect(() => {
    console.log('[APP] Setting up global functions...');

    setFunction('logOut', async () => {
      console.log(
        `[AUTH] Logging out of current session... (user: ${client.user?._id})`,
      );
      storage.set('token', '');
      storage.set('sessionID', '');
      app.openChannel(null);
      setStatus('loggedOut');
      await client.logout();
      app.setLoggedOutScreen('loginPage');
    });
  }, []);

  useEffect(() => {
    console.log('[APP] Setting up global listeners...');

    function handleConnectingEvent() {
      app.setLoadingStage('connecting');
      console.log(`[APP] Connecting to instance... (${new Date().getTime()})`);
    }

    function handleConnectedEvent() {
      app.setLoadingStage('connected');
      console.log(`[APP] Connected to instance (${new Date().getTime()})`);
    }

    async function handleReadyEvent() {
      let fetchedOrderedServers = [];
      let fetchedChannelNotificationSettings = {};
      let fetchedServerNotificationSettings = {};

      try {
        const rawSettings = await client.syncFetchSettings([
          'ordering',
          'notifications',
        ]);
        try {
          fetchedOrderedServers = JSON.parse(rawSettings.ordering[1]).servers;
          const notificationSettings = JSON.parse(rawSettings.notifications[1]);
          fetchedChannelNotificationSettings = notificationSettings.channel;
          fetchedServerNotificationSettings = notificationSettings.server;
        } catch (err) {
          console.log(`[APP] Error parsing fetched settings: ${err}`);
        }
      } catch (err) {
        console.log(`[APP] Error fetching settings: ${err}`);
      }

      setOrderedServers(fetchedOrderedServers);
      channelNotificationSettings.current = fetchedChannelNotificationSettings;
      serverNotificationSettings.current = fetchedServerNotificationSettings;
      setStatus('loggedIn');

      console.log(`[APP] Client is ready (${new Date().getTime()})`);

      setUpNotifeeListener(client);
    }

    function handleUserSettingsPacket(
      packet: any, // ClientboundNotification where packet.type === 'UserSettingsUpdate'
    ) {
      console.log('[WEBSOCKET] Synced settings updated');
      const newSettings = packet.update;
      try {
        if ('ordering' in newSettings) {
          const newOrderedServers = JSON.parse(newSettings.ordering[1]).servers;
          setOrderedServers(newOrderedServers);
        }
        if ('notifications' in newSettings) {
          const {server, channel} = JSON.parse(newSettings.notifications[1]);
          channelNotificationSettings.current = channel;
          serverNotificationSettings.current = server;
        }
      } catch (err) {
        console.log(`[APP] Error fetching settings: ${err}`);
      }
    }
    function handleServerDeletion(server: string) {
      const currentServer = app.getCurrentServer();
      if (currentServer === server) {
        app.openServer(undefined);
        app.openChannel(null);
      }
    }

    function onNewPacket(p: ClientboundNotification) {
      if (p.type === 'UserSettingsUpdate') {
        handleUserSettingsPacket(p);
      }
    }

    function setUpListeners() {
      client.on('connecting', handleConnectingEvent);
      client.on('connected', handleConnectedEvent);
      client.on('ready', handleReadyEvent);
      client.on('packet', onNewPacket);
      client.on('server/delete', handleServerDeletion);
    }

    function cleanupListeners() {
      client.removeListener('connecting', handleConnectingEvent);
      client.removeListener('connected', handleConnectedEvent);
      client.removeListener('ready', handleReadyEvent);
      client.removeListener('packet', onNewPacket);
      client.removeListener('server/delete', handleServerDeletion);
    }

    try {
      setUpListeners();
    } catch (err) {
      console.log(`[MAINVIEW] Error setting up global listeners: ${err}`);
    }

    return () => cleanupListeners();
  }, []);

  useEffect(() => {
    randomizeRemark();
  }, [status]);

  useEffect(() => {
    async function login() {
      console.log(`[APP] Mounted component (${new Date().getTime()})`);

      let defaultNotif = await createChannel();
      console.log(`[NOTIFEE] Created channel: ${defaultNotif}`);

      checkLastVersion();

      await loginWithSavedToken(status);
    }

    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrderedServersContext.Provider value={{orderedServers, setOrderedServers}}>
      {status === 'loggedIn' ? (
        <LoggedInViews
          channelNotificationSettings={channelNotificationSettings}
          serverNotificationSettings={serverNotificationSettings}
        />
      ) : status === 'loggedOut' ? (
        <LoginViews markAsLoggedIn={() => setStatus('loggedIn')} />
      ) : (
        <LoadingScreen
          header={'app.loading.unknown_state'}
          body={'app.loading.unknown_state_body'}
          bodyParams={{state: status}}
          styles={{
            loadingScreen: {
              backgroundColor: currentTheme.backgroundPrimary,
            },
          }}
        />
      )}
    </OrderedServersContext.Provider>
  );
}
