import {useCallback, useRef, useState} from 'react';
import {Modal} from 'react-native';
import {observer} from 'mobx-react-lite';

import type BottomSheetCore from '@gorhom/bottom-sheet';

import type {API, Channel, Message, Server, User} from 'revolt.js';

import {app, setFunction} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import type {
  CreateChannelModalProps,
  DeletableObject,
  MemberWithModAction,
  ReportedObject,
  SettingsSection,
  TextEditingModalProps,
} from '@clerotri/lib/types';
import {BottomSheet} from '@clerotri/components/common/BottomSheet';
import {ImageViewer} from '@clerotri/components/ImageViewer';
import {
  ConfirmDeletionModal,
  ConfirmModActionModal,
  CreateChannelModal,
  NewInviteModal,
  TextEditModal,
} from '@clerotri/components/modals';
import {FloatingModal} from './components/modals/common';
import {
  AnalyticsSettingsSheet,
  BotInviteSheet,
  ChangelogSheet,
  ChannelInfoSheet,
  ChannelMenuSheet,
  ChannelSwitcherSheet,
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
import {useBackHandler} from '@react-native-community/hooks';
import {sleep} from './lib/utils';

const BottomSheets = observer(() => {
  const sheetRef = useRef<BottomSheetCore>(null);

  const [sheetState, setSheetState] = useState(-1);

  const [currentSheet, setCurrentSheet] = useState<string | null>(null);

  const [profileMenuUser, setProfileMenuUser] = useState<User | null>(null);
  const [profileMenuServer, setProfileMenuServer] = useState<Server | null>(
    null,
  );
  const [reportMenuObject, setReportMenuObject] =
    useState<ReportedObject | null>(null);
  const [channelMenuChannel, setChannelMenuChannel] = useState<Channel | null>(
    null,
  );
  const [channelInfoChannel, setChannelInfoChannel] = useState<Channel | null>(
    null,
  );
  const [serverInfoServer, setServerInfoServer] = useState<Server | null>(null);
  const [pinnedMessagesChannel, setPinnedMessagesChannel] =
    useState<Channel | null>(null);
  const [memberListContext, setMemberListContext] = useState<
    Channel | Server | null
  >(null);
  const [messageMenuMessage, setMessageMenuMessage] = useState<Message | null>(
    null,
  );

  const openOrCloseSheet = useCallback(
    (newState: boolean, sheetName: string) => {
      if (newState && sheetState !== -1) {
        sheetRef.current?.close();
        sleep(250).then(() => {
          setCurrentSheet(newState ? sheetName : null);
          sheetRef.current?.expand();
        });
        return;
      }

      setCurrentSheet(newState ? sheetName : null);
      newState ? sheetRef.current?.expand() : sheetRef.current?.close();
    },
    [sheetState],
  );

  const handleSheetIndexChange = useCallback((index: number) => {
    setSheetState(index);
    if (index === -1) {
      setCurrentSheet(null);
    }
  }, []);

  useBackHandler(() => {
    if (sheetState !== -1) {
      sheetRef.current?.close();
      setCurrentSheet(null);
      return true;
    }

    return false;
  });

  setFunction('openStatusMenu', (show: boolean) => {
    openOrCloseSheet(show, 'statusMenu');
  });

  setFunction('openProfile', (u?: User | null, s?: Server | null) => {
    setProfileMenuUser(u === undefined ? null : u);
    setProfileMenuServer(s === undefined ? null : s);
    openOrCloseSheet(!!u, 'profileMenu');
  });

  setFunction('openReportMenu', (o: ReportedObject | null) => {
    setReportMenuObject(o);
    openOrCloseSheet(!!o, 'reportMenu');
  });

  setFunction('openChannelContextMenu', (c: Channel | null) => {
    setChannelMenuChannel(c);
    openOrCloseSheet(!!c, 'channelMenu');
  });

  setFunction('openChannelInfoMenu', (c: Channel | null) => {
    setChannelInfoChannel(c);
    openOrCloseSheet(!!c, 'channelInfo');
  });

  setFunction('openServerContextMenu', (s: Server | null) => {
    setServerInfoServer(s);
    openOrCloseSheet(!!s, 'serverInfo');
  });

  setFunction('openPinnedMessagesMenu', (c: Channel | null) => {
    setPinnedMessagesChannel(c);
    openOrCloseSheet(!!c, 'pinnedMessages');
  });

  setFunction('openMemberList', (ctx: Channel | Server | null) => {
    setMemberListContext(ctx);
    openOrCloseSheet(!!ctx, 'memberList');
  });

  setFunction('openMessage', (m: Message | null) => {
    setMessageMenuMessage(m);
    openOrCloseSheet(!!m, 'messageMenu');
  });

  return (
    <BottomSheet sheetRef={sheetRef} onChange={handleSheetIndexChange}>
      {currentSheet === 'statusMenu' ? (
        <StatusSheet />
      ) : currentSheet === 'profileMenu' ? (
        <ProfileSheet user={profileMenuUser} server={profileMenuServer} />
      ) : currentSheet === 'reportMenu' ? (
        <ReportSheet object={reportMenuObject} />
      ) : currentSheet === 'channelMenu' ? (
        <ChannelMenuSheet channel={channelMenuChannel} />
      ) : currentSheet === 'channelInfo' ? (
        <ChannelInfoSheet channel={channelInfoChannel} />
      ) : currentSheet === 'serverInfo' ? (
        <ServerInfoSheet server={serverInfoServer} />
      ) : currentSheet === 'pinnedMessages' ? (
        <PinnedMessagesSheet channel={pinnedMessagesChannel} />
      ) : currentSheet === 'memberList' ? (
        <MemberListSheet context={memberListContext} />
      ) : currentSheet === 'messageMenu' ? (
        <MessageMenuSheet message={messageMenuMessage} />
      ) : null}
    </BottomSheet>
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
  const [moderatedMember, setModeratedMember] =
    useState<MemberWithModAction | null>(null);

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
  setFunction('openModActionModal', (member: MemberWithModAction | null) => {
    setModeratedMember(member);
  });

  return (
    <>
      <FloatingModal
        visible={!!deletableObject}
        onRequestClose={() => setDeletableObject(null)}>
        <ConfirmDeletionModal target={deletableObject!} />
      </FloatingModal>
      <FloatingModal
        visible={!!editingText}
        onRequestClose={() => setEditingText(null)}>
        <TextEditModal object={editingText!} />
      </FloatingModal>
      <FloatingModal
        visible={!!createChannelObject}
        onRequestClose={() => setCreateChannelObject(null)}>
        <CreateChannelModal object={createChannelObject!} />
      </FloatingModal>
      <FloatingModal
        visible={!!newInviteCode}
        onRequestClose={() => setNewInviteCode(null)}>
        <NewInviteModal code={newInviteCode!} />
      </FloatingModal>
      <FloatingModal
        visible={!!moderatedMember}
        onRequestClose={() => setModeratedMember(null)}>
        <ConfirmModActionModal target={moderatedMember!} />
      </FloatingModal>
    </>
  );
});

const OtherModals = observer(() => {
  const [imageViewerState, setImageViewerState] = useState({
    i: null as any,
  });
  const [settingsVisibility, setSettingsVisibility] = useState(false);
  const [initialSettingsSection, setInitialSettingsSection] =
    useState<SettingsSection | null>(null);
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
  const [inviteBot, setInviteBot] = useState(null as API.PublicBot | null);

  setFunction('openDirectMessage', (dm: Channel) => {
    app.openProfile(null);
    app.openChannel(dm);
  });
  setFunction('openImage', (a: any) => {
    setImageViewerState({i: a});
  });
  setFunction('openSettings', (o: boolean | SettingsSection) => {
    if (typeof o !== 'boolean') {
      setInitialSettingsSection(o);
      setSettingsVisibility(true);
    } else {
      setInitialSettingsSection(null);
      setSettingsVisibility(o);
    }
  });
  setFunction('openServerSettings', (s: Server | null) => {
    setServerSettingsServer(s);
  });
  setFunction('openInvite', async (i: string) => {
    try {
      const community = await client.fetchInvite(i);
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
      <Modal
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
      </Modal>
      <Modal
        visible={settingsVisibility}
        transparent={true}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() =>
          app.handleSettingsVisibility(setSettingsVisibility)
        }>
        <SettingsSheet
          initialSection={initialSettingsSection}
          setState={() => setSettingsVisibility(false)}
        />
      </Modal>
      <Modal
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
      </Modal>
      <Modal
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
      </Modal>
      <Modal
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
      </Modal>
    </>
  );
});

// these need to be available before the app is logged in
export const PreLoginModals = observer(() => {
  const [analyticsSettingsVisibility, setAnalyticsSettingsVisibility] =
    useState(false);
  const [analyticsSettingsBlockClosing, setAnalyticsSettingsBlockClosing] =
    useState(false);
  const [changelogVisibility, setChangelogVisibility] = useState(false);
  const [changelogIsNewlyUpdated, setChangelogIsNewlyUpdated] = useState(false);

  setFunction('openAnalyticsMenu', (o: boolean, blockClosing?: boolean) => {
    setAnalyticsSettingsBlockClosing(blockClosing || false);
    setAnalyticsSettingsVisibility(o);
  });

  setFunction('openChangelog', (show: boolean, isNewlyUpdated?: boolean) => {
    setChangelogIsNewlyUpdated(isNewlyUpdated || false);
    setChangelogVisibility(show);
  });

  return (
    <>
      <Modal
        visible={analyticsSettingsVisibility}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() =>
          app.handleAnalyticsSettingsVisibility(setAnalyticsSettingsVisibility)
        }>
        <AnalyticsSettingsSheet
          blockClosing={analyticsSettingsBlockClosing}
          setState={() => setAnalyticsSettingsVisibility(false)}
        />
      </Modal>
      <Modal
        visible={changelogVisibility}
        transparent={true}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setChangelogVisibility(false)}>
        <ChangelogSheet
          setState={() => setChangelogVisibility(false)}
          isNewlyUpdated={changelogIsNewlyUpdated}
        />
      </Modal>
    </>
  );
});

export const Modals = observer(() => {
  return (
    <>
      <BottomSheets />
      {/* this one breaks when trying to move it to the new bottom sheet component (swiping back doesn't work properly unless you select another server or enter text for some reason???) */}
      <ChannelSwitcherSheet />
      <FloatingModals />
      <OtherModals />
    </>
  );
});
