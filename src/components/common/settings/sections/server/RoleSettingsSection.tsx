/* eslint-disable no-bitwise */
import {useContext, useState} from 'react';
import {type ColorValue, Modal, Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {Trans, useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';
import ColourPicker, {
  HueCircular,
  OpacitySlider,
  Panel1,
} from 'reanimated-color-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Permission, type API, type Server} from 'revolt.js';

import {app, setFunction} from '@clerotri/Generic';
import {SettingsSection} from '@clerotri/lib/types';
import {styles} from '@clerotri/Theme';
import {
  BackButton,
  Button,
  Checkbox,
  InputWithButtonV2,
  Text,
} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {
  PressableSettingsEntry,
  SettingsEntry,
} from '@clerotri/components/common/settings/atoms';
import {GapView} from '@clerotri/components/layout';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

const RoleSettingsRoleList = observer(
  ({server, setSection}: {server: Server; setSection: Function}) => {
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
                colour={r.colour ?? undefined}
                style={{fontWeight: 'bold'}}>
                {r.name}
              </Text>
              <Text useNewText colour={'foregroundSecondary'}>
                {r.id}
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
                <MaterialIcon name={'arrow-forward'} size={20} />
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
    const insets = useSafeAreaInsets();

    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    const [colour, setColour] = useState('');
    const [showColourPicker, setShowColourPicker] = useState(false);

    const onSelectColour = ({hex}: {hex: string}) => {
      setColour(hex);
    };

    return (
      <>
        <Text type={'h1'} customColour={role.colour ?? undefined}>
          {role.name}
        </Text>
        <Text useNewText colour={'foregroundSecondary'}>
          {roleID}
        </Text>
        <GapView size={8} />
        <Text type={'h2'}>{t('app.servers.settings.roles.name')}</Text>
        <InputWithButtonV2
          inputProps={{
            placeholder: t('app.servers.settings.roles.name_placeholder'),
            defaultValue: role.name,
          }}
          buttonProps={{
            children: <MaterialIcon name={'save'} size={20} />,
          }}
          containerStyles={{backgroundColor: currentTheme.backgroundSecondary}}
          buttonStyles={{borderStartColor: currentTheme.backgroundPrimary}}
          callback={v => {
            server.editRole(roleID, {
              name: v,
            });
          }}
          skipIfSame
          cannotBeEmpty
          emptyError={t('app.servers.settings.roles.errors.empty_role_name')}
        />
        <GapView size={4} />
        <Text type={'h2'}>{t('app.servers.settings.roles.rank')}</Text>
        <InputWithButtonV2
          inputProps={{
            placeholder: t('app.servers.settings.roles.rank_placeholder'),
            defaultValue: `${role.rank}`,
            keyboardType: 'decimal-pad',
          }}
          buttonProps={{
            children: <MaterialIcon name={'save'} size={20} />,
          }}
          containerStyles={{backgroundColor: currentTheme.backgroundSecondary}}
          buttonStyles={{borderStartColor: currentTheme.backgroundPrimary}}
          callback={v => {
            const int = parseInt(v!, 10);
            server.editRole(roleID, {
              rank: int,
            });
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
            <Text useNewText colour={'foregroundSecondary'}>
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
            <Text useNewText colour={'foregroundSecondary'}>
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
              <MaterialIcon name={'arrow-forward'} size={20} />
            </View>
          </View>
        </PressableSettingsEntry>
        <GapView size={8} />
        <Text type={'h2'}>{t('app.servers.settings.roles.colour')}</Text>
        <View style={localStyles.colourContainer}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <View style={localStyles.colourPreview(role.colour)} />
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
                <MaterialIcon name={'edit'} size={20} />
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
                <MaterialIcon name={'content-copy'} size={20} />
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
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={() => setShowColourPicker(false)}>
          <View
            style={{
              flex: 1,
              padding: commonValues.sizes.large,
              paddingBlockStart: insets.top + commonValues.sizes.large,
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
          <Text useNewText colour={'foregroundSecondary'}>
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
              await server.setPermissions(roleID, {
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
              (role.permissions.d & number) === number &&
                localStyles.permissionDenied,
            ]}>
            <MaterialIcon
              name={'close'}
              size={20}
              color={
                (role.permissions.d & number) === number
                  ? 'backgroundSecondary'
                  : 'error'
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
                (role.permissions.a & number) !== number &&
                localStyles.permissionNeutral,
            ]}>
            <MaterialIcon
              name={'horizontal-rule'}
              size={20}
              color={
                (role.permissions.d & number) !== number &&
                (role.permissions.a & number) !== number
                  ? 'backgroundSecondary'
                  : 'foregroundSecondary'
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
              await server.setPermissions(roleID, {
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
              (role.permissions.a & number) === number &&
                localStyles.permissionAllowed,
            ]}>
            <MaterialIcon
              name={'check'}
              size={20}
              color={
                (role.permissions.a & number) === number
                  ? 'backgroundSecondary'
                  : 'accentColor'
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
    const {t} = useTranslation();

    return (
      <>
        <Text type={'h1'}>
          <Trans
            t={t}
            i18nKey={'app.servers.settings.roles.permissions_list_header'}
            tOptions={{role: role.name}}>
            Permissions for{' '}
            <Text colour={role.colour ?? undefined}>{role.name}</Text>
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

const localStyles = StyleSheet.create(currentTheme => ({
  colourContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: currentTheme.backgroundSecondary,
    padding: commonValues.sizes.medium,
    borderRadius: commonValues.sizes.medium,
  },
  colourPreview: (roleColour?: ColorValue | null) => ({
    padding: commonValues.sizes.xl,
    borderRadius: commonValues.sizes.medium,
    marginEnd: commonValues.sizes.medium,
    backgroundColor: roleColour ?? '#00000000',
  }),
  permissionDenied: {
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.error,
  },
  permissionNeutral: {
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.foregroundSecondary,
  },
  permissionAllowed: {
    borderRadius: commonValues.sizes.medium,
    backgroundColor: currentTheme.accentColor,
  },
}));
