import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {User} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {Button} from '@clerotri/components/common/atoms';
import {MiniProfile} from '@clerotri/components/common/profile';
import {commonValues} from '@clerotri/lib/themes';

export const UserList = observer(({users}: {users: User[]}) => {
  return (
    <>
      {users.map(u => (
        <Button
          key={`userlist-button-${u._id}`}
          style={localStyles.container}
          onPress={() => app.openProfile(u)}>
          <View
            key={`userlist-content-wrapper-${u._id}`}
            style={{maxWidth: '90%'}}>
            <MiniProfile key={`userlist-content-${u._id}`} user={u} />
          </View>
        </Button>
      ))}
    </>
  );
});

const localStyles = StyleSheet.create(currentTheme => ({
  container: {
    marginHorizontal: 0,
    paddingHorizontal: commonValues.sizes.medium,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: currentTheme.backgroundPrimary,
  },
}));
