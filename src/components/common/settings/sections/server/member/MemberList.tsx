import {useContext, useEffect, useState} from 'react';
import {Platform, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {LegendList} from '@legendapp/list';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {API, Member, Server} from 'revolt.js';

import {settings} from '@clerotri/lib/settings';
import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms';
import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';
import {PressableSettingsEntry} from '@clerotri/components/common/settings/atoms';
import {
  SelectionContext,
  SelectedMembersContext,
} from '@clerotri/components/common/settings/sections/server/member/state';
import {client} from '@clerotri/lib/client';
import {commonValues} from '@clerotri/lib/themes';

const MemberListEntry = observer(
  ({item, setMember}: {item: Member; setMember: () => void}) => {
    const {selectionMode, setSelectionMode} = useContext(SelectionContext);

    const {selectedMembers, setSelectedMembers} = useContext(
      SelectedMembersContext,
    );

    const selectMember = () => {
      const isPresent = selectedMembers.find(m => m._id.user === item._id.user);

      if (!isPresent) {
        console.log('not present');
        setSelectedMembers([...selectedMembers, item]);
        console.log(selectedMembers);
      } else {
        console.log('present');
        setSelectedMembers(
          selectedMembers.filter(m => m._id.user !== item._id.user),
        );
      }
    };

    return (
      <PressableSettingsEntry
        style={{flexDirection: 'column'}}
        key={`member-settings-entry-${item._id.user}`}
        onPress={() => {
          selectionMode ? selectMember() : setMember();
        }}
        onLongPress={() => {
          if (settings.get('ui.settings.showExperimental')) {
            setSelectionMode(true);
            selectMember();
          }
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text
              useNewText
              key={`member-settings-entry-${item._id.user}-id`}
              customColour={item.roleColour ?? undefined}
              style={{fontWeight: 'bold'}}>
              {item.nickname ?? item.user?.display_name ?? item.user?.username}
            </Text>
            <Text useNewText colour={'foregroundSecondary'}>
              @{item.user?.username}#{item.user?.discriminator}
            </Text>
            <Text useNewText colour={'foregroundSecondary'}>
              {item._id.user}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcon
              name={
                selectionMode
                  ? selectedMembers.find(m => m._id.user === item._id.user)
                    ? 'radio-button-on'
                    : 'radio-button-off'
                  : 'arrow-forward'
              }
              size={20}
            />
          </View>
        </View>
      </PressableSettingsEntry>
    );
  },
);

export const MemberList = observer(
  ({server, setMember}: {server: Server; setMember: Function}) => {
    const insets = useSafeAreaInsets();

    const {t} = useTranslation();

    const {selectionMode, setSelectionMode} = useContext(SelectionContext);

    const [reload, triggerReload] = useState(0);
    const [members, setMembers] = useState(null as Member[] | null);

    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

    useEffect(() => {
      async function fetchMembers() {
        const m = await server.fetchMembers();
        setMembers(m.members);
      }

      fetchMembers();
    }, [server, reload]);

    useEffect(() => {
      console.log(
        '[MEMBERSETTINGS] Setting up listeners for the member list...',
      );

      function onUserJoin(m: Member) {
        console.log('hi!');
        if (m._id.server === server._id) {
          triggerReload(count => count + 1);
        }
      }

      function onUserLeave(m: API.MemberCompositeKey) {
        console.log('bye!');
        if (m.server === server._id) {
          triggerReload(count => count + 1);
        }
      }

      function setUpListeners() {
        client.addListener('member/join', onUserJoin);
        client.addListener('member/leave', onUserLeave);
      }

      function cleanupListeners() {
        client.removeListener('member/join', onUserJoin);
        client.removeListener('member/leave', onUserLeave);
      }

      try {
        setUpListeners();
      } catch (err) {
        console.log(
          `[MEMBERSETTINGS] Error setting up listeners for the member list: ${err}`,
        );
      }

      // called when the list is remounted
      return () => cleanupListeners();
    }, [server._id]);

    useEffect(() => {
      console.log('?');
      if (!selectionMode) {
        setSelectedMembers([]);
      }
    }, [selectionMode]);

    const renderItem = ({item}: {item: Member}) => {
      return (
        <MemberListEntry
          item={item}
          setMember={() => {
            setMember(item);
          }}
        />
      );
    };

    const keyExtractor = (item: Member) => {
      return `member-${item._id.user}`;
    };

    return (
      <SelectedMembersContext.Provider
        value={{selectedMembers, setSelectedMembers}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: commonValues.sizes.medium,
          }}>
          <Text type={'h1'}>
            {selectionMode
              ? t('app.servers.settings.members.select_mode.title', {
                  count: selectedMembers.length,
                })
              : t('app.servers.settings.members.title')}
          </Text>
          {settings.get('ui.settings.showExperimental') && (
            <Pressable
              onPress={() => {
                setSelectionMode(currentStatus => !currentStatus);
              }}
              style={{
                width: 30,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcon
                  name={
                    selectionMode ? 'close' : 'checkbox-multiple-blank-outline'
                  }
                  size={24}
                />
              </View>
            </Pressable>
          )}
        </View>
        {members ? (
          <LegendList
            key={'server-settings-members-list'}
            keyExtractor={keyExtractor}
            data={members}
            contentContainerStyle={{
              paddingBottom: Platform.OS === 'web' ? 0 : insets.bottom,
            }}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text>{t('app.servers.settings.members.loading')}</Text>
        )}
      </SelectedMembersContext.Provider>
    );
  },
);
