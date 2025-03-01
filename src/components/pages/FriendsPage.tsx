import {useContext, useMemo, useState} from 'react';
import {
  Platform,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import type {User} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {styles} from '@clerotri/Theme';
import {MiniProfile} from '@clerotri/components/common/profile';
import {ChannelHeader} from '@clerotri/components/navigation/ChannelHeader';
import {SpecialChannelIcon} from '@clerotri/components/navigation/SpecialChannelIcon';
import {Button, Text} from '@clerotri/components/common/atoms';

type DisplayStates = {
  onlineFriends: boolean;
  offlineFriends: boolean;
  incoming: boolean;
  outgoing: boolean;
  blocked: boolean;
};

function sortUsers(unsortedUsers: User[]) {
  console.log('sus');

  const users = unsortedUsers
    .sort((user1, user2) => user1.username.localeCompare(user2.username))
    .filter(
      user =>
        user.relationship === 'Incoming' ||
        user.relationship === 'Outgoing' ||
        user.relationship === 'Friend' ||
        user.relationship === 'Blocked',
    );

  return users;
}

/*
 * Sorts the users into each category and returns a data object for the SectionList
 */
function finalSort(users: User[]) {
  const onlineFriends = [] as User[];
  const offlineFriends = [] as User[];
  const incoming = [] as User[];
  const outgoing = [] as User[];
  const blocked = [] as User[];

  for (const user of users) {
    switch (user.relationship) {
      case 'Friend':
        (user.online ? onlineFriends : offlineFriends).push(user);
        break;
      case 'Incoming':
        incoming.push(user);
        break;
      case 'Outgoing':
        outgoing.push(user);
        break;
      case 'Blocked':
        blocked.push(user);
        break;
      default:
        break;
    }
  }
  return [
    {title: 'incoming', data: incoming},
    {title: 'outgoing', data: outgoing},
    {title: 'onlineFriends', data: onlineFriends},
    {title: 'offlineFriends', data: offlineFriends},
    {title: 'blocked', data: blocked},
  ];
}

const UserButton = observer(({user}: {user: User}) => {
  return (
    <Button
      style={{justifyContent: 'flex-start'}}
      key={user._id}
      onPress={() => app.openProfile(user)}>
      <View style={{maxWidth: '90%'}}>
        <MiniProfile user={user} scale={1.15} />
      </View>
    </Button>
  );
});

// TODO: refresh when relationships update
export const FriendsPage = observer(() => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const [displayState, setDisplayState] = useState({
    onlineFriends: true,
    offlineFriends: true,
    outgoing: true,
    incoming: true,
    blocked: true,
  } as DisplayStates);

  // sort the user list and filter for friends/blocked users/outgoing/incoming friend requests...
  const sortedUsers = useMemo(() => sortUsers([...client.users.values()]), []);

  // ...then group the filtered users and prepare the data object for the SectionList
  const groups = useMemo(() => {
    return finalSort(sortedUsers);
  }, [sortedUsers]);

  const renderItem = ({
    section,
    item,
  }: {
    section: {title: string};
    item: User;
  }) => {
    // @ts-expect-error this will always be one of the section types specified above, but SectionList just says "here's a string :3"
    if (displayState[section.title]) {
      return <UserButton user={item} />;
    }
    return null;
  };

  const renderHeader = ({
    section: {title, data},
  }: {
    section: {title: string; data: User[]};
  }) => {
    return (
      <View style={{backgroundColor: currentTheme.backgroundPrimary}}>
        <TouchableOpacity
          onPress={() =>
            setDisplayState({
              ...displayState,
              // @ts-expect-error per above
              [title]: !displayState[title],
            })
          }>
          <Text style={localStyles.friendsListHeader}>
            {t(`app.friends_list.${title}`, {count: data.length})}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = ({
    section: {title, data},
  }: {
    section: {title: string; data: User[]};
  }) => {
    if (data.length > 0) {
      return <></>;
    }
    return (
      <Text style={{marginInline: 10}}>
        {t(`app.friends_list.${title}_empty`)}
      </Text>
    );
  };

  const keyExtractor = (item: User) => {
    return `friends-list-${item._id}`;
  };

  return (
    <View style={styles.flex}>
      <ChannelHeader
        icon={<SpecialChannelIcon channel={'Friends'} />}
        name={'Friends'}
      />
      <SectionList
        key={'friends-list-sectionlist'}
        keyExtractor={keyExtractor}
        sections={groups}
        style={{flex: 1}}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'web' ? 0 : commonValues.sizes.medium,
        }}
        renderSectionHeader={renderHeader}
        renderSectionFooter={renderFooter}
        renderItem={renderItem}
        stickySectionHeadersEnabled
      />
    </View>
  );
});

const localStyles = StyleSheet.create({
  friendsListHeader: {
    fontWeight: 'bold',
    margin: 5,
    marginLeft: 10,
    marginTop: 10,
    textTransform: 'uppercase',
  },
});
