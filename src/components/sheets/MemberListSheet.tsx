import {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type BottomSheetCore from '@gorhom/bottom-sheet';

import {Server, type Channel, type User} from 'revolt.js';

import {setFunction} from '@clerotri/Generic';
import {Text} from '../common/atoms';
import {BottomSheet} from '../common/BottomSheet';
import {UserList} from '../navigation/UserList';
import {useBackHandler} from '@clerotri/lib/ui';

export const MemberListSheet = observer(() => {
  const [context, setContext] = useState(null as Channel | Server | null);
  const [users, setUsers] = useState([] as User[]);

  const sheetRef = useRef<BottomSheetCore>(null);

  useBackHandler(() => {
    if (context) {
      sheetRef.current?.close();
      return true;
    }

    return false;
  });

  setFunction('openMemberList', (ctx: Channel | Server | null) => {
    if (ctx !== context) {
      setUsers([]);
    }
    setContext(ctx);
    ctx ? sheetRef.current?.expand() : sheetRef.current?.close();
  });

  useEffect(() => {
    async function getUsers() {
      if (!context) {
        return;
      }
      const u =
        context instanceof Server
          ? (await context.fetchMembers()).users
          : await context.fetchMembers();

      setUsers(u);
    }
    getUsers();
  }, [context]);

  return (
    <BottomSheet sheetRef={sheetRef}>
      <View style={{paddingHorizontal: 16}}>
        {!context ? (
          <></>
        ) : (
          <>
            <Text type={'h1'}>{context.name ?? context._id} members</Text>
            <UserList users={users} />
            <View style={{marginTop: 10}} />
          </>
        )}
      </View>
    </BottomSheet>
  );
});
