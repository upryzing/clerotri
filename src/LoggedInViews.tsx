import {type RefObject, useEffect, useState} from 'react';

import type {API, ClientboundNotification, Server} from 'revolt.js';

import {app, appVersion, setFunction, settings} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {Modals} from '@clerotri/Modals';
import {SideMenuHandler} from '@clerotri/SideMenu';
import {NetworkIndicator} from '@clerotri/components/NetworkIndicator';
import {Notification} from '@clerotri/components/Notification';
import {handleMessageNotification} from '@clerotri/lib/notifications';
import {ChannelContext, ServerContext} from '@clerotri/lib/state';
import {storage} from '@clerotri/lib/storage';
import {CVChannel} from '@clerotri/lib/types';
import {checkLastVersion, openLastChannel, sleep} from '@clerotri/lib/utils';

export function LoggedInViews({
  channelNotificationSettings,
  serverNotificationSettings,
}: {
  channelNotificationSettings: RefObject<any>;
  serverNotificationSettings: RefObject<any>;
}) {
  const [currentChannel, setCurrentChannel] = useState<CVChannel>(null);
  const [currentServer, setCurrentServer] = useState<Server | null>(null);

  setFunction('openChannel', (c: CVChannel) => {
    setCurrentChannel(c);
  });

  setFunction('getCurrentChannel', () => {
    return currentChannel;
  });

  setFunction('openServer', (s: Server | null) => {
    setCurrentServer(s);
  });

  setFunction('getCurrentServer', () => {
    return currentServer?._id ?? undefined;
  });

  const [notificationMessage, setNotificationMessage] =
    useState<API.Message | null>(null);

  useEffect(() => {
    const lastVersion = checkLastVersion();

    if (lastVersion !== 'current') {
      storage.set('lastVersion', appVersion);

      if (lastVersion) {
        if (settings.get('app.showChangelogs')) {
          console.log(`[APP] Opening changelog...`);
          // don't ask why but the sheet doesn't appear without this
          sleep(50).then(() => {
            app.openChangelog(true);
          });
        }
      }
    }
  }, []);

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
    storage.set('lastServer', currentServer?._id || 'DirectMessage');
  }, [currentServer]);

  useEffect(() => {
    console.log('[APP] Setting up packet listeners...');

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

    function handleServerDeletion(server: string) {
      if (currentServer?._id === server) {
        setCurrentServer(null);
        setCurrentChannel(null);
      }
    }

    function setUpPacketListeners() {
      client.on('packet', onNewPacket);
      client.on('server/delete', handleServerDeletion);
    }

    function cleanupPacketListeners() {
      client.removeListener('packet', onNewPacket);
      client.removeListener('server/delete', handleServerDeletion);
    }

    try {
      setUpPacketListeners();
    } catch (err) {
      console.log(`[LOGGEDINVIEWS] Error setting up global listeners: ${err}`);
    }

    return () => cleanupPacketListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ServerContext.Provider value={{currentServer, setCurrentServer}}>
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
    </ServerContext.Provider>
  );
}
