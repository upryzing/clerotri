import {useState} from 'react';
import {Modal, type ModalProps, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type {API, Channel, Server, User} from 'revolt.js';

import {app, setFunction} from '@clerotri/Generic';
import {client} from './lib/client';
import {
  CreateChannelModalProps,
  DeletableObject,
  TextEditingModalProps,
} from '@clerotri/lib/types';
import {ImageViewer} from '@clerotri/components/ImageViewer';
import {
  ConfirmDeletionModal,
  CreateChannelModal,
  NewInviteModal,
  TextEditModal,
} from '@clerotri/components/modals';
import {
  BotInviteSheet,
  ChannelInfoSheet,
  ChannelMenuSheet,
  MemberListSheet,
  MessageMenuSheet,
  PinnedMessagesSheet,
  ProfileSheet,
  ReportSheet,
  ServerInfoSheet,
  ServerInviteSheet,
  ServerSettingsSheet,
  SettingsSheet,
  StatusSheet,
} from '@clerotri/components/sheets';

// Modals appear to break on the new architecture unless you wrap them in a View. see also https://github.com/react-navigation/react-navigation/issues/12301#issuecomment-2501692557
const FixedModal = observer((props: ModalProps) => {
  return (
    <View>
      <Modal {...props} />
    </View>
  );
});

const BottomSheets = observer(() => {
  return (
    <>
      <MessageMenuSheet />
      <ChannelMenuSheet />
      <StatusSheet />
      <ProfileSheet />
      <ReportSheet />
      <ChannelInfoSheet />
      <MemberListSheet />
      <PinnedMessagesSheet />
      <ServerInfoSheet />
    </>
  );
});

const FloatingModals = observer(() => {
  const [deletableObject, setDeletableObject] = useState(
    null as DeletableObject | null,
  );
  const [editingText, setEditingText] = useState(
    null as TextEditingModalProps | null,
  );
  const [createChannelObject, setCreateChannelObject] = useState(
    null as CreateChannelModalProps | null,
  );
  const [newInviteCode, setNewInviteCode] = useState(null as string | null);

  setFunction('openDeletionConfirmationModal', (o: DeletableObject | null) => {
    setDeletableObject(o);
  });
  setFunction('openTextEditModal', (object: TextEditingModalProps | null) => {
    setEditingText(object);
  });
  setFunction(
    'openCreateChannelModal',
    (object: CreateChannelModalProps | null) => {
      setCreateChannelObject(object);
    },
  );
  setFunction('openNewInviteModal', (code: string | null) => {
    setNewInviteCode(code);
  });

  return (
    <>
      <FixedModal
        visible={!!deletableObject}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        backdropColor={'#00000020'}
        onRequestClose={() => setDeletableObject(null)}>
        <View style={localStyles.modalContainer}>
          <ConfirmDeletionModal target={deletableObject!} />
        </View>
      </FixedModal>
      <FixedModal
        visible={!!editingText}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        backdropColor={'#00000020'}
        onRequestClose={() => setEditingText(null)}>
        <View style={localStyles.modalContainer}>
          <TextEditModal object={editingText!} />
        </View>
      </FixedModal>
      <FixedModal
        visible={!!createChannelObject}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        backdropColor={'#00000020'}
        onRequestClose={() => setCreateChannelObject(null)}>
        <View style={localStyles.modalContainer}>
          <CreateChannelModal object={createChannelObject!} />
        </View>
      </FixedModal>
      <FixedModal
        visible={!!newInviteCode}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        backdropColor={'#00000020'}
        onRequestClose={() => setNewInviteCode(null)}>
        <View style={localStyles.modalContainer}>
          <NewInviteModal code={newInviteCode!} />
        </View>
      </FixedModal>
    </>
  );
});

const OtherModals = observer(() => {
  const [imageViewerState, setImageViewerState] = useState({
    i: null as any,
  });
  const [settingsVisibility, setSettingsVisibility] = useState(false);
  const [serverSettingsServer, setServerSettingsServer] = useState(
    null as Server | null,
  );
  const [inviteServer, setInviteServer] = useState({
    inviteServer: null,
    inviteServerCode: '',
  } as {
    inviteServer: API.InviteResponse | null;
    inviteServerCode: string;
  });
  const [inviteBot, setInviteBot] = useState(null as User | null);

  setFunction('openDirectMessage', (dm: Channel) => {
    app.openProfile(null);
    app.openChannel(dm);
  });
  setFunction('openImage', (a: any) => {
    setImageViewerState({i: a});
  });
  setFunction('openSettings', (o: boolean) => {
    setSettingsVisibility(o);
  });
  setFunction('openServerSettings', (s: Server | null) => {
    setServerSettingsServer(s);
  });
  setFunction('openInvite', async (i: string) => {
    try {
      let community = await client.fetchInvite(i);
      if (community.type === 'Server') {
        setInviteServer({
          inviteServer: community,
          inviteServerCode: i,
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
  setFunction('openBotInvite', async (id: string) => {
    setInviteBot(await client.bots.fetchPublic(id).catch(e => e));
  });

  return (
    <>
      <FixedModal
        visible={!!imageViewerState.i}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setImageViewerState({i: null})}>
        <ImageViewer
          state={imageViewerState}
          setState={() => setImageViewerState({i: null})}
        />
      </FixedModal>
      <FixedModal
        visible={settingsVisibility}
        transparent={true}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() =>
          app.handleSettingsVisibility(setSettingsVisibility)
        }>
        <SettingsSheet setState={() => setSettingsVisibility(false)} />
      </FixedModal>
      <FixedModal
        visible={!!inviteServer.inviteServer}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() =>
          setInviteServer({inviteServer: null, inviteServerCode: ''})
        }>
        <ServerInviteSheet
          setState={() => {
            setInviteServer({
              inviteServer: null,
              inviteServerCode: '',
            });
          }}
          // @ts-expect-error this will always be a server response (TODO: figure out a solution?)
          server={inviteServer.inviteServer}
          inviteCode={inviteServer.inviteServerCode}
        />
      </FixedModal>
      <FixedModal
        visible={!!inviteBot}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setInviteBot(null)}>
        <BotInviteSheet
          setState={() => {
            setInviteBot(null);
          }}
          bot={inviteBot!}
        />
      </FixedModal>
      <FixedModal
        visible={!!serverSettingsServer}
        transparent={true}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() =>
          app.handleServerSettingsVisibility(setServerSettingsServer)
        }>
        <ServerSettingsSheet
          server={serverSettingsServer!}
          setState={() => setServerSettingsServer(null)}
        />
      </FixedModal>
    </>
  );
});

export const Modals = observer(() => {
  return (
    <>
      <BottomSheets />
      <FloatingModals />
      <OtherModals />
    </>
  );
});

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
