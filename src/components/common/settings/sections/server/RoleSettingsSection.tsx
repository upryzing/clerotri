/* eslint-disable no-bitwise */
import {useContext, useState} from 'react';
import {Modal, Pressable, View} from 'react-native';
import {Trans, useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import ColourPicker, {
  HueCircular,
  OpacitySlider,
  Panel1,
} from 'reanimated-color-picker';

import {Permission, type API, type Server} from 'revolt.js';

import {app, setFunction} from '@clerotri/Generic';
import {SettingsSection} from '@clerotri/lib/types';
import {styles} from '@clerotri/Theme';
import {
  BackButton,
  Button,
  Checkbox,
  InputWithButton,
  Text,
} from '@clerotri/components/common/atoms';
import {
  PressableSettingsEntry,
  SettingsEntry,
} from '@clerotri/components/common/settings/atoms';
import {GapView} from '@clerotri/components/layout';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

const RoleSettingsRoleList = observer(
  ({server, setSection}: {server: Server; setSection: Function}) => {
    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    return (
      <>
        <Text type={'h1'}>{t('app.servers.settings.roles.title')}</Text>
        {server.orderedRoles.map(r => (
          <PressableSettingsEntry
            key={`role-settings-entry-${r.id}`}
            onPress={() => {
              setSection({section: 'roles', subsection: r.id});
            }}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text
                key={`role-settings-entry-${r.id}-name`}
                colour={r.colour ?? currentTheme.foregroundPrimary}
                style={{fontWeight: 'bold'}}>
                {r.name}
              </Text>
              <Text colour={currentTheme.foregroundSecondary}>{r.id}</Text>
            </View>
            <View
              style={{
                width: 30,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'arrow-forward'}
                  size={20}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
            </View>
          </PressableSettingsEntry>
        ))}
      </>
    );
  },
);

const RoleSettings = observer(
  ({
    server,
    role,
    roleID,
    setSection,
  }: {
    server: Server;
    role: API.Role;
    roleID: string;
    setSection: Function;
  }) => {
    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    const [colour, setColour] = useState('');
    const [showColourPicker, setShowColourPicker] = useState(false);

    const onSelectColour = ({hex}: {hex: string}) => {
      setColour(hex);
    };

    return (
      <>
        <Text
          type={'h1'}
          colour={role.colour ?? currentTheme.foregroundPrimary}>
          {role.name}
        </Text>
        <Text colour={currentTheme.foregroundSecondary}>{roleID}</Text>
        <GapView size={8} />
        <Text type={'h2'}>{t('app.servers.settings.roles.name')}</Text>
        <InputWithButton
          placeholder={t('app.servers.settings.roles.name_placeholder')}
          defaultValue={role.name}
          onPress={async (v: string) => {
            await server.editRole(roleID, {
              name: v,
            });
          }}
          buttonContents={{
            type: 'icon',
            name: 'save',
            pack: 'regular',
          }}
          skipIfSame
          cannotBeEmpty
          emptyError={t('app.servers.settings.roles.errors.empty_role_name')}
        />
        <GapView size={4} />
        <Text type={'h2'}>{t('app.servers.settings.roles.rank')}</Text>
        <InputWithButton
          placeholder={t('app.servers.settings.roles.rank_placeholder')}
          defaultValue={`${role.rank}`}
          // @ts-expect-error this is passed down to the TextInput
          keyboardType={'decimal-pad'}
          onPress={async (v: string) => {
            const int = parseInt(v, 10);
            await server.editRole(roleID, {
              rank: int,
            });
          }}
          buttonContents={{
            type: 'icon',
            name: 'save',
            pack: 'regular',
          }}
          skipIfSame
          cannotBeEmpty
          emptyError={t('app.servers.settings.roles.errors.empty_rank')}
        />
        <GapView size={4} />
        <Text type={'h2'}>
          {t('app.servers.settings.roles.options_header')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text style={{fontWeight: 'bold'}}>
              {t('app.servers.settings.roles.options.hoist')}
            </Text>
            <Text colour={currentTheme.foregroundSecondary}>
              {t('app.servers.settings.roles.options.hoist_body')}
            </Text>
          </View>
          <Checkbox
            value={role.hoist ?? false}
            callback={async () => {
              try {
                await server.editRole(roleID, {
                  hoist: !role.hoist,
                });
              } catch (error) {
                `${error}`.match('429')
                  ? showToast(t('app.misc.generic_errors.rateLimited_toast'))
                  : null;
              }
            }}
          />
        </View>
        <GapView size={8} />
        <PressableSettingsEntry
          onPress={() => {
            setSection({section: 'roles', subsection: `${roleID}-permissions`});
          }}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text style={{fontWeight: 'bold'}}>
              {t('app.servers.settings.roles.permissions')}
            </Text>
            <Text colour={currentTheme.foregroundSecondary}>
              {t('app.servers.settings.roles.permissions_body')}
            </Text>
          </View>
          <View
            style={{
              width: 30,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={styles.iconContainer}>
              <MaterialIcon
                name={'arrow-forward'}
                size={20}
                color={currentTheme.foregroundPrimary}
              />
            </View>
          </View>
        </PressableSettingsEntry>
        <GapView size={8} />
        <Text type={'h2'}>{t('app.servers.settings.roles.colour')}</Text>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: currentTheme.backgroundSecondary,
            padding: commonValues.sizes.medium,
            borderRadius: commonValues.sizes.medium,
          }}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <View
              style={{
                padding: commonValues.sizes.xl,
                borderRadius: commonValues.sizes.medium,
                marginEnd: commonValues.sizes.medium,
                backgroundColor: role.colour ?? '#00000000',
              }}
            />
            <Text>{role.colour ?? 'No colour'}</Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <Pressable
              style={{
                width: 30,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setColour(role.colour ?? '#00000000');
                setShowColourPicker(true);
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'edit'}
                  size={20}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
            </Pressable>
            <Pressable
              style={{
                width: 30,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => Clipboard.setString(role.colour ?? 'No colour')}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'content-copy'}
                  size={20}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
            </Pressable>
          </View>
        </View>
        <GapView size={8} />
        <Button
          style={{marginHorizontal: 0}}
          backgroundColor={currentTheme.error}
          onPress={() => {
            app.openDeletionConfirmationModal({
              type: 'Role',
              object: {role: roleID, server},
            });
          }}>
          <Text>{t('app.servers.settings.roles.delete')}</Text>
        </Button>
        <Modal
          visible={showColourPicker}
          animationType="slide"
          onRequestClose={() => setShowColourPicker(false)}>
          <View
            style={{
              flex: 1,
              padding: commonValues.sizes.large,
              backgroundColor: currentTheme.backgroundPrimary,
            }}>
            <BackButton
              callback={() => {
                setShowColourPicker(false);
              }}
            />
            <View
              style={{
                flex: 1,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Text
                colour={colour}
                style={{
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                {role.name}
              </Text>
              <GapView size={8} />
              <ColourPicker
                style={{alignSelf: 'center', width: '70%'}}
                value={role.colour ?? '#00000000'}
                onCompleteJS={onSelectColour}>
                <HueCircular
                  containerStyle={{
                    backgroundColor: currentTheme.backgroundPrimary,
                  }}
                />
                <GapView size={8} />
                <Panel1 />
                <GapView size={8} />
                <OpacitySlider />
              </ColourPicker>
              <GapView size={8} />
              <Button
                onPress={() => {
                  setShowColourPicker(false);
                  app.openTextEditModal({
                    initialString: colour,
                    id: 'role_colour',
                    callback: c => {
                      if (c.length < 10) {
                        server.editRole(roleID, {colour: c});
                      }
                    },
                  });
                }}>
                <Text>{t('app.servers.settings.roles.open_colour_modal')}</Text>
              </Button>
              <GapView size={8} />
              <Button
                onPress={() => {
                  setShowColourPicker(false);
                  server.editRole(roleID, {colour: colour});
                }}>
                <Text>{t('app.servers.settings.roles.set_colour')}</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </>
    );
  },
);

const RolePermissionSelector = observer(
  ({
    server,
    role,
    roleID,
    name,
    number,
  }: {
    server: Server;
    role: API.Role;
    roleID: string;
    name: string;
    number: number;
  }) => {
    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    function addToAllowed() {
      return Number(BigInt(role.permissions.a) | BigInt(number));
    }

    function removeFromAllowed() {
      return Number(BigInt(role.permissions.a) ^ BigInt(number));
    }

    function addToDenied() {
      return Number(BigInt(role.permissions.d) | BigInt(number));
    }

    function removeFromDenied() {
      return Number(BigInt(role.permissions.d) ^ BigInt(number));
    }

    return (
      <SettingsEntry key={`role-permission-settings-entry-${name}`}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <Text
            key={`role-permission-settings-entry-${name}-name`}
            style={{fontWeight: 'bold'}}>
            {t(`app.permissions.${name}`)}
          </Text>
          <Text colour={currentTheme.foregroundSecondary}>
            {t(`app.permissions.${name}_body_server`)}
          </Text>
        </View>
        <Pressable
          key={`role-permission-settings-entry-${name}-deny`}
          onPress={async () => {
            try {
              if ((role.permissions.d & number) === number) {
                return;
              }
              server.setPermissions(roleID, {
                allow:
                  (role.permissions.a & number) === number
                    ? removeFromAllowed()
                    : role.permissions.a,
                deny: addToDenied(),
              });
            } catch (error) {
              `${error}`.match('429')
                ? showToast(t('app.misc.generic_errors.rateLimited_toast'))
                : null;
            }
          }}
          style={{
            marginStart: commonValues.sizes.medium,
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={[
              styles.iconContainer,
              (role.permissions.d & number) === number && {
                borderRadius: commonValues.sizes.medium,
                backgroundColor: currentTheme.error,
              },
            ]}>
            <MaterialIcon
              name={'close'}
              size={20}
              color={
                (role.permissions.d & number) === number
                  ? currentTheme.backgroundSecondary
                  : currentTheme.error
              }
            />
          </View>
        </Pressable>
        <Pressable
          key={`role-permission-settings-entry-${name}-neutral`}
          onPress={async () => {
            try {
              if (
                (role.permissions.d & number) !== number &&
                (role.permissions.a & number) !== number
              ) {
                return;
              }
              await server.setPermissions(roleID, {
                allow:
                  (role.permissions.a & number) === number
                    ? role.permissions.a - number
                    : role.permissions.a,
                deny:
                  (role.permissions.d & number) === number
                    ? role.permissions.d - number
                    : role.permissions.d,
              });
            } catch (error) {
              `${error}`.match('429')
                ? showToast(t('app.misc.generic_errors.rateLimited_toast'))
                : null;
            }
          }}
          style={{
            marginStart: commonValues.sizes.medium,
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={[
              styles.iconContainer,
              (role.permissions.d & number) !== number &&
                (role.permissions.a & number) !== number && {
                  borderRadius: commonValues.sizes.medium,
                  backgroundColor: currentTheme.foregroundSecondary,
                },
            ]}>
            <MaterialIcon
              name={'horizontal-rule'}
              size={20}
              color={
                (role.permissions.d & number) !== number &&
                (role.permissions.a & number) !== number
                  ? currentTheme.backgroundSecondary
                  : currentTheme.foregroundSecondary
              }
            />
          </View>
        </Pressable>
        <Pressable
          key={`role-permission-settings-entry-${name}-allow`}
          onPress={async () => {
            try {
              if ((role.permissions.a & number) === number) {
                return;
              }
              server.setPermissions(roleID, {
                allow: addToAllowed(),
                deny:
                  (role.permissions.d & number) === number
                    ? removeFromDenied()
                    : role.permissions.d,
              });
            } catch (error) {
              `${error}`.match('429')
                ? showToast(t('app.misc.generic_errors.rateLimited_toast'))
                : null;
            }
          }}
          style={{
            marginStart: commonValues.sizes.medium,
            width: 30,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={[
              styles.iconContainer,
              (role.permissions.a & number) === number && {
                borderRadius: commonValues.sizes.medium,
                backgroundColor: currentTheme.accentColor,
              },
            ]}>
            <MaterialIcon
              name={'check'}
              size={20}
              color={
                (role.permissions.a & number) === number
                  ? currentTheme.backgroundSecondary
                  : currentTheme.accentColor
              }
            />
          </View>
        </Pressable>
      </SettingsEntry>
    );
  },
);

// these are either solely for (voice) channels or internal
const NON_SERVER_PERMISSIONS = [
  'ReadMessageHistory',
  'Video',
  'Speak',
  'MuteMembers',
  'DeafenMembers',
  'MoveMembers',
  'GrantAllSafe',
];

const RolePermissionSettings = observer(
  ({
    server,
    role,
    roleID,
  }: {
    server: Server;
    role: API.Role;
    roleID: string;
  }) => {
    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    return (
      <>
        <Text type={'h1'}>
          <Trans
            t={t}
            i18nKey={'app.servers.settings.roles.permissions_list_header'}
            tOptions={{role: role.name}}>
            Permissions for{' '}
            <Text colour={role.colour ?? currentTheme.foregroundPrimary}>
              {role.name}
            </Text>
          </Trans>
        </Text>
        <Text>{t('app.servers.settings.roles.permissions_list_body')}</Text>
        {Object.entries(Permission)
          .filter(([name]) => {
            return !NON_SERVER_PERMISSIONS.includes(name);
          })
          .map(([name, number]) => (
            <RolePermissionSelector
              key={`rps-${roleID}-${name}`}
              server={server}
              role={role}
              roleID={roleID}
              name={name}
              number={number}
            />
          ))}
      </>
    );
  },
);

export const RoleSettingsSection = observer(
  ({
    server,
    section,
    setSection,
  }: {
    server: Server;
    section: SettingsSection;
    setSection: Function;
  }) => {
    setFunction('closeRoleSubsection', () => {
      setSection({section: 'roles', subsection: undefined});
    });

    return (
      <>
        <BackButton
          callback={() => {
            section!.subsection
              ? section?.subsection.match('-permissions')
                ? setSection({
                    section: 'roles',
                    subsection: section.subsection.replace('-permissions', ''),
                  })
                : setSection({section: 'roles', subsection: undefined})
              : setSection(null);
          }}
          margin
        />
        {section!.subsection !== undefined ? (
          section!.subsection.match('-permissions') ? (
            <RolePermissionSettings
              server={server}
              role={
                server.roles![section!.subsection!.replace('-permissions', '')]
              }
              roleID={section!.subsection!.replace('-permissions', '')}
            />
          ) : (
            <RoleSettings
              server={server}
              role={server.roles![section!.subsection!]}
              roleID={section!.subsection!}
              setSection={setSection}
            />
          )
        ) : (
          <RoleSettingsRoleList server={server} setSection={setSection} />
        )}
      </>
    );
  },
);
