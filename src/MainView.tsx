import {useContext, useEffect, useRef, useState} from 'react';

import type {ClientboundNotification} from 'revolt.js';

import {app, randomizeRemark, setFunction} from '@clerotri/Generic';
import {LoggedInViews} from '@clerotri/LoggedInViews';
import {PreLoginModals} from '@clerotri/Modals';
import {client} from '@clerotri/lib/client';
import {LoadingScreen} from '@clerotri/components/views/LoadingScreen';
import {loginWithSavedToken} from '@clerotri/lib/auth';
import {createChannel, setUpNotifeeListener} from '@clerotri/lib/notifications';
import {OrderedServersContext} from '@clerotri/lib/state';
import {storage} from '@clerotri/lib/storage';
import {ThemeContext} from '@clerotri/lib/themes';
import {checkLastVersion} from '@clerotri/lib/utils';
import {LoginViews} from '@clerotri/pages/LoginViews';
import {generateAnalyticsObject} from '@clerotri/lib/analytics';
import {ANALYTICS_ENDPOINT} from '@clerotri/lib/consts';

export function MainView() {
  const {currentTheme} = useContext(ThemeContext);

  const [status, setStatus] = useState('loggedOut');

  const [orderedServers, setOrderedServers] = useState<string[]>([]);

  const channelNotificationSettings = useRef<any>(undefined);
  const serverNotificationSettings = useRef<any>(undefined);

  useEffect(() => {
    async function sendAnalytics(analyticsSetting: 'basic' | 'full') {
      if (!__DEV__) {
        try {
          const data = generateAnalyticsObject(analyticsSetting);
          await fetch(ANALYTICS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(data),
          });
        } catch (err) {
          console.log(`[ANALYTICS] Error sending analytics: ${err}`);
        }
      } else {
        console.log(
          `[ANALYTICS] Skipping analytics submission in dev mode (tier: ${analyticsSetting})`,
        );
      }
    }
    const analyticsSetting = storage.getString('app.analyticsLevel') as
      | 'basic'
      | 'full'
      | 'none'
      | undefined;

    if (analyticsSetting) {
      analyticsSetting !== 'none' && sendAnalytics(analyticsSetting);
    } else {
      app.openAnalyticsMenu(true, true);
    }
  }, []);

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
    }

    function cleanupListeners() {
      client.removeListener('connecting', handleConnectingEvent);
      client.removeListener('connected', handleConnectedEvent);
      client.removeListener('ready', handleReadyEvent);
      client.removeListener('packet', onNewPacket);
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
      {/* these need to be available before the app is logged in */}
      <PreLoginModals />
    </OrderedServersContext.Provider>
  );
}
