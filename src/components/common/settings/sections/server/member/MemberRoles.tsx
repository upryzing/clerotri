import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {Trans, useTranslation} from 'react-i18next';

import {observer} from 'mobx-react-lite';

import type {API, Member, Server} from 'revolt.js';

import {Checkbox, Text} from '@clerotri/components/common/atoms';
import {
  MaterialCommunityIcon,
  MaterialIcon,
} from '@clerotri/components/common/icons';
import {GapView} from '@clerotri/components/layout';
import {commonValues} from '@clerotri/lib/themes';
import {arraysAreEqual, showToast} from '@clerotri/lib/utils';
import {styles} from '@clerotri/Theme';

// a role object from Member.orderedRoles. copied from revolt.js on 13/03/2026
type OrderedRole = {
  name: string;
  permissions: API.OverrideField;
  colour?: string | null;
  hoist?: boolean;
  rank?: number;
  id: string;
};

export const CurrentRolesContext = createContext<{
  currentRoles: string[];
  setCurrentRoles: Dispatch<SetStateAction<string[]>>;
}>({currentRoles: [], setCurrentRoles: () => {}});

const RoleEntry = observer(({role}: {role: OrderedRole}) => {
  const {currentRoles, setCurrentRoles} = useContext(CurrentRolesContext);

  const toggleRole = () => {
    if (currentRoles.includes(role.id)) {
      const newRoles = currentRoles.filter(r => r !== role.id);
      setCurrentRoles(newRoles);
    } else {
      setCurrentRoles([...currentRoles, role.id]);
    }
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <Text
          useNewText
          style={{fontWeight: 'bold'}}
          customColour={role.colour ?? undefined}>
          {role.name}
        </Text>
        <Text useNewText colour={'foregroundSecondary'}>
          {role.id}
        </Text>
      </View>
      <View>
        <Checkbox
          value={currentRoles.includes(role.id)}
          callback={() => toggleRole()}
        />
      </View>
    </View>
  );
});

export const MemberRoles = observer(
  ({server, member}: {server: Server; member: Member}) => {
    const {t} = useTranslation();

    const [currentRoles, setCurrentRoles] = useState(member.roles ?? []);

    const displayName =
      member.nickname ?? member.user?.display_name ?? member.user?.username;

    const rolesAreUnchanged = useMemo(
      () => arraysAreEqual(currentRoles, member.roles ?? []),
      [currentRoles, member.roles],
    );

    const saveRoles = async () => {
      try {
        await member.edit({roles: currentRoles});
      } catch (error) {
        try {
          JSON.stringify(error).match('retry_after')
            ? showToast(t('app.misc.generic_errors.rateLimited_toast'))
            : console.log(`${error}`);
        } catch {}
      }
    };

    return (
      <CurrentRolesContext.Provider value={{currentRoles, setCurrentRoles}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text type={'h1'}>
            <Trans
              t={t}
              i18nKey={'app.servers.settings.members.roles.header'}
              tOptions={{name: displayName}}>
              <Text colour={member.roleColour ?? undefined}>{displayName}</Text>
              's roles
            </Trans>
          </Text>
          <View style={{flexDirection: 'row', gap: commonValues.sizes.medium}}>
            <Pressable
              onPress={() => {
                setCurrentRoles(member.roles ?? []);
              }}
              style={{
                width: 30,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcon
                  name={'close'}
                  size={24}
                  color={rolesAreUnchanged ? 'foregroundSecondary' : undefined}
                />
              </View>
            </Pressable>
            <Pressable
              onPress={async () => {
                await saveRoles();
              }}
              style={{
                width: 30,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'save'}
                  size={24}
                  color={rolesAreUnchanged ? 'foregroundSecondary' : undefined}
                />
              </View>
            </Pressable>
          </View>
        </View>
        <GapView size={8} />
        <ScrollView contentContainerStyle={localStyles.container}>
          <View style={localStyles.innerContainer}>
            {server.orderedRoles.map(role => {
              return <RoleEntry key={`member-roles-${role.id}`} role={role} />;
            })}
          </View>
        </ScrollView>
      </CurrentRolesContext.Provider>
    );
  },
);

const localStyles = StyleSheet.create((_, rt) => ({
  container: {
    paddingBlockEnd: commonValues.sizes.xl + rt.insets.bottom,
  },
  innerContainer: {
    gap: commonValues.sizes.medium,
  },
}));
