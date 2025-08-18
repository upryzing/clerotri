import {useContext} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';

import type {Server, User} from 'revolt.js';

import {client} from '@clerotri/lib/client';
import {Text} from '@clerotri/components/common/atoms/Text';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {getColour, showToast} from '@clerotri/lib/utils';

type RoleViewProps = {
  server: Server;
  user: User;
};

export const RoleView = observer(({server, user}: RoleViewProps) => {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const handlePress = (id: string) => {
    Clipboard.setString(id);
    showToast(t('app.profile.roles.copied_role_id_toast'));
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
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: commonValues.sizes.small,
        }}>
        {roles.map((r, i) => (
          <Pressable
            onPress={() => handlePress(memberObject.roles![i])}
            key={`roleview-${server._id}-${r.name}-${i}`}
            style={{
              flexDirection: 'row',
              padding: commonValues.sizes.medium,
              backgroundColor: currentTheme.backgroundPrimary,
              borderRadius: commonValues.sizes.medium,
            }}>
            <View
              key={`roleview-${server._id}-${r.name}-colour`}
              style={{
                borderRadius: 10000,
                backgroundColor: r.colour
                  ? getColour(r.colour, currentTheme)
                  : currentTheme.foregroundSecondary,
                height: 16,
                width: 16,
                margin: commonValues.sizes.xs,
                marginRight: 6,
              }}
            />
            <Text>{r.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
});
