import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';

import type {Server, User} from 'revolt.js';

import {Text} from '@clerotri/components/common/atoms/Text';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {commonValues} from '@clerotri/lib/themes';
import {getColour, showToast} from '@clerotri/lib/utils';

type RoleViewProps = {
  server: Server;
  user: User;
};

export const RoleView = observer(({server, user}: RoleViewProps) => {
  const {t} = useTranslation();

  const handlePress = (id: string) => {
    Clipboard.setString(id);
    showToast(t('app.profile.roles.copied_role_id_toast'));
  };

  const handleEditPress = () => {
    app.openProfile(null);
    app.openServerSettings(server, {
      section: 'members',
      subsection: `member-${user._id}-roles`,
    });
  };
  // don't bother doing anything if the server has no roles
  if (!server.roles) {
    return <></>;
  }

  const memberObject = client.members.getKey({
    server: server?._id,
    user: user?._id,
  });

  if (!memberObject || !memberObject.roles) {
    return <></>;
  }

  const roles = memberObject.roles.map(r => server.roles![r]);

  return (
    <View style={{marginBlockEnd: commonValues.sizes.medium}}>
      <Text type={'profile'}>{t('app.profile.roles_header')}</Text>
      <View
        key={`roleview-${server._id}-container`}
        style={localStyles.container}>
        {roles.map((r, i) => (
          <Pressable
            onPress={() => handlePress(memberObject.roles![i])}
            key={`roleview-${server._id}-${r.name}-${i}`}
            style={localStyles.roleButton}>
            <View
              key={`roleview-${server._id}-${r.name}-colour`}
              style={localStyles.colourCircle(r.colour)}
            />
            <Text>{r.name}</Text>
          </Pressable>
        ))}
        {server.owner === client.user?._id ||
        (server.havePermission('ManageRole') && memberObject.inferior) ? (
          <Pressable
            onPress={() => handleEditPress()}
            key={`roleview-${server._id}-edit-roles`}
            style={[localStyles.roleButton, localStyles.editButton]}>
            <MaterialIcon
              name={'edit'}
              size={18}
              color={'foregroundSecondary'}
            />
            <Text
              useNewText
              colour={'foregroundSecondary'}
              style={localStyles.editText}>
              {t('app.profile.roles.edit')}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});

const localStyles = StyleSheet.create(currentTheme => ({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: commonValues.sizes.small,
  },
  roleButton: {
    flexDirection: 'row',
    padding: commonValues.sizes.medium,
    backgroundColor: currentTheme.backgroundPrimary,
    borderRadius: commonValues.sizes.medium,
  },
  colourCircle: (colour?: string | null) => ({
    borderRadius: 10000,
    backgroundColor: colour
      ? getColour(colour, currentTheme)
      : currentTheme.foregroundSecondary,
    height: 16,
    width: 16,
    margin: commonValues.sizes.xs,
    marginEnd: commonValues.sizes.medium,
  }),
  editButton: {
    backgroundColor: 'transparent',
    gap: commonValues.sizes.medium,
  },
  editText: {
    fontWeight: 'bold',
  },
}));
