import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Server, type Channel, type User} from 'revolt.js';

import {Text} from '../common/atoms';
import {UserList} from '../navigation/UserList';

export const MemberListSheet = observer(
  ({context}: {context: Channel | Server | null}) => {
    const [users, setUsers] = useState([] as User[]);

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
    );
  },
);
