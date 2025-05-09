import {type RefObject, useEffect, useState} from 'react';

import type {API, ClientboundNotification} from 'revolt.js';

import {setFunction, settings} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {Modals} from '@clerotri/Modals';
import {SideMenuHandler} from '@clerotri/SideMenu';
import {NetworkIndicator} from '@clerotri/components/NetworkIndicator';
import {Notification} from '@clerotri/components/Notification';
import {handleMessageNotification} from '@clerotri/lib/notifications';
import {ChannelContext} from '@clerotri/lib/state';
import {storage} from '@clerotri/lib/storage';
import {CVChannel} from '@clerotri/lib/types';
import {openLastChannel} from '@clerotri/lib/utils';

export function LoggedInViews({
  channelNotificationSettings,
  serverNotificationSettings,
}: {
  channelNotificationSettings: RefObject<any>;
  serverNotificationSettings: RefObject<any>;
}) {
  const [currentChannel, setCurrentChannel] = useState<CVChannel>(null);

  setFunction('openChannel', (c: CVChannel) => {
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
