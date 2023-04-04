import React from 'react';
import {
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {observer} from 'mobx-react-lite';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import {getApiLevel, getBrand, getDevice} from 'react-native-device-info';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {ContextButton, app, client, Setting} from '../../Generic';
import {currentTheme, styles} from '../../Theme';
import {Text} from '../common/atoms';

type Section = string | null;

const BoolSetting = observer(
  ({
    sRaw,
    experimentalFunction,
    devFunction,
  }: {
    sRaw: Setting;
    experimentalFunction: any;
    devFunction: any;
  }) => {
    const [value, setValue] = React.useState(
      app.settings.get(sRaw.key) as boolean,
    );
    return (
      <View
        key={`settings_${sRaw.key}`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        {sRaw.experimental ? (
          <View style={styles.iconContainer}>
            <FA5Icon name="flask" size={16} color={currentTheme.accentColor} />
          </View>
        ) : null}
        {sRaw.developer ? (
          <View style={styles.iconContainer}>
            <FA5Icon name="bug" size={16} color={currentTheme.accentColor} />
          </View>
        ) : null}
        <Text style={{flex: 1, fontWeight: 'bold'}}>{sRaw.name}</Text>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: value
              ? currentTheme.accentColor
              : currentTheme.backgroundSecondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            const newValue = !value;
            app.settings.set(sRaw.key, newValue);
            setValue(newValue);
            sRaw.key === 'ui.settings.showExperimental'
              ? experimentalFunction(newValue)
              : null;
            sRaw.key === 'ui.showDeveloperFeatures'
              ? devFunction(newValue)
              : null;
          }}>
          <Text
            style={{
              color: value
                ? currentTheme.accentColorForeground
                : currentTheme.foregroundPrimary,
            }}>
            {value ? (
              <FA5Icon
                name="check"
                color={currentTheme.accentColorForeground}
                size={24}
              />
            ) : null}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);

const StringNumberSetting = observer(({sRaw}: {sRaw: Setting}) => {
  const [value, setValue] = React.useState(app.settings.getRaw(sRaw.key));
  return (
    <View
      key={`settings_${sRaw.key}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      }}>
      {sRaw.options ? (
        <View>
          {sRaw.experimental ? (
            <View style={styles.iconContainer}>
              <FA5Icon
                name="flask"
                size={16}
                color={currentTheme.accentColor}
              />
            </View>
          ) : null}
          {sRaw.developer ? (
            <View style={styles.iconContainer}>
              <FA5Icon name="bug" size={16} color={currentTheme.accentColor} />
            </View>
          ) : null}
          <Text style={{flex: 1, fontWeight: 'bold'}}>{sRaw.name}</Text>
          <ScrollView
            style={{
              borderRadius: 8,
              maxHeight: 160,
              minWidth: '100%',
              backgroundColor: currentTheme.backgroundSecondary,
              padding: 8,
              paddingRight: 12,
            }}>
            {sRaw.options.map(o => (
              <TouchableOpacity
                key={o}
                style={styles.actionTile}
                onPress={() => {
                  app.settings.set(sRaw.key, o);
                  setValue(o);
                }}>
                <Text>
                  {o} {value === o ? <Text>(active)</Text> : null}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={{marginTop: 2}} />
          </ScrollView>
        </View>
      ) : (
        <View>
          {sRaw.experimental ? (
            <View style={styles.iconContainer}>
              <FA5Icon
                name="flask"
                size={16}
                color={currentTheme.accentColor}
              />
            </View>
          ) : null}
          {sRaw.developer ? (
            <View style={styles.iconContainer}>
              <FA5Icon name="bug" size={16} color={currentTheme.accentColor} />
            </View>
          ) : null}
          <Text style={{flex: 1, fontWeight: 'bold'}}>{sRaw.name}</Text>
          <TextInput
            style={{
              minWidth: '100%',
              borderRadius: 8,
              backgroundColor: currentTheme.backgroundSecondary,
              padding: 6,
              paddingLeft: 10,
              paddingRight: 10,
              color: currentTheme.foregroundPrimary,
            }}
            value={value as string}
            keyboardType={sRaw.type === 'number' ? 'decimal-pad' : 'default'}
            onChangeText={v => {
              app.settings.set(sRaw.key, v);
              setValue(v);
            }}
          />
        </View>
      )}
    </View>
  );
});

async function copyDebugInfo() {
  const obj = {
    deviceInfo: {
      time: new Date().getTime(),
      model: `${getBrand()}/${await getDevice()}`,
      version: `${await getApiLevel()}`,
    },

    appInfo: {
      userID: client.user?._id,
      settings: await AsyncStorage.getItem('settings'),
      version: app.version,
    },
  };

  Clipboard.setString(JSON.stringify(obj));
}

function copyDebugInfoWrapper() {
  copyDebugInfo().then(() => {
    return null;
  });
}

const SettingsCategory = observer(
  ({category, friendlyName}: {category: string; friendlyName: string}) => {
    const [showExperimental, setShowExperimental] = React.useState(
      app.settings.get('ui.settings.showExperimental') as boolean,
    );

    const [showDev, setShowDev] = React.useState(
      app.settings.get('ui.showDeveloperFeatures') as boolean,
    );

    return (
      <View key={`settings-category-${category}`}>
        <Text type={'header'}>{friendlyName}</Text>
        {app.settings.list.map(sRaw => {
          try {
            if (sRaw.experimental && !showExperimental) {
              return null;
            }
            if (sRaw.developer && !showDev) {
              return null;
            }
            if (sRaw.category !== category) {
              return null;
            }
            if (sRaw.type === 'boolean') {
              return (
                <BoolSetting
                  sRaw={sRaw}
                  experimentalFunction={setShowExperimental}
                  devFunction={setShowDev}
                />
              );
            } else if (sRaw.type === 'string' || sRaw.type === 'number') {
              return <StringNumberSetting sRaw={sRaw} />;
            }
          } catch (err) {
            console.log(err);
          }
        })}
      </View>
    );
  },
);

export const SettingsSheet = observer(({state}: {state: any}) => {
  const [section, setSection] = React.useState(null as Section);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentTheme.backgroundPrimary,
        padding: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}>
      {section == null ? (
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
          onPress={() => {
            state.setState({settingsOpen: false});
          }}>
          <AntIcon
            name="closecircle"
            size={24}
            color={currentTheme.foregroundSecondary}
          />
          <Text
            style={{
              color: currentTheme.foregroundSecondary,
              fontSize: 20,
              marginLeft: 5,
            }}>
            Close
          </Text>
        </Pressable>
      ) : (
        <></>
      )}
      <ScrollView style={{flex: 1}}>
        {section == null ? (
          <>
            <Text type={'header'}>App</Text>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection('appearance');
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'palette'}
                  color={currentTheme.foregroundPrimary}
                  size={25}
                />
              </View>
              <Text>Appearance</Text>
            </ContextButton>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection('functionality');
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'build'}
                  color={currentTheme.foregroundPrimary}
                  size={20}
                />
              </View>
              <Text>Features</Text>
            </ContextButton>
            <Text type={'header'}>Account</Text>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                setSection('account');
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'person'}
                  color={currentTheme.foregroundPrimary}
                  size={25}
                />
              </View>
              <Text>Account</Text>
            </ContextButton>
            <Text type={'header'}>Advanced</Text>
            <ContextButton
              style={{flex: 1, marginBottom: 10}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                copyDebugInfoWrapper();
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name={'bug-report'}
                  color={currentTheme.foregroundPrimary}
                  size={25}
                />
              </View>
              <Text>Copy Debug Info</Text>
            </ContextButton>
            <ContextButton
              backgroundColor={currentTheme.error}
              style={{justifyContent: 'center', marginTop: 10}}
              onPress={() => {
                app.settings.clear();
              }}>
              <Text style={{color: currentTheme.accentColorForeground}}>
                Reset Settings
              </Text>
            </ContextButton>
          </>
        ) : section === 'appearance' ? (
          <>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}
              onPress={() => {
                setSection(null);
              }}>
              <AntIcon
                name="back"
                size={24}
                color={currentTheme.foregroundSecondary}
              />
              <Text
                style={{
                  color: currentTheme.foregroundSecondary,
                  fontSize: 20,
                  marginLeft: 5,
                }}>
                Back
              </Text>
            </Pressable>
            <SettingsCategory
              category={'appearance'}
              friendlyName={'Appearance'}
            />
          </>
        ) : section === 'functionality' ? (
          <>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}
              onPress={() => {
                setSection(null);
              }}>
              <AntIcon
                name="back"
                size={24}
                color={currentTheme.foregroundSecondary}
              />
              <Text
                style={{
                  color: currentTheme.foregroundSecondary,
                  fontSize: 20,
                  marginLeft: 5,
                }}>
                Back
              </Text>
            </Pressable>
            <SettingsCategory
              category={'functionality'}
              friendlyName={'Features'}
            />
          </>
        ) : section === 'account' ? (
          <View>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}
              onPress={() => {
                setSection(null);
              }}>
              <AntIcon
                name="back"
                size={24}
                color={currentTheme.foregroundSecondary}
              />
              <Text
                style={{
                  color: currentTheme.foregroundSecondary,
                  fontSize: 20,
                  marginLeft: 5,
                }}>
                Back
              </Text>
            </Pressable>
            <Text type={'header'}>Account</Text>
            <ContextButton
              style={{flex: 1}}
              backgroundColor={currentTheme.backgroundSecondary}
              onPress={() => {
                Clipboard.setString(client.user?.username!);
              }}>
              <Text>
                Username{'\n'}
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 12,
                    color: currentTheme.foregroundSecondary,
                  }}>
                  {client.user?.username}
                </Text>
              </Text>
            </ContextButton>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
});