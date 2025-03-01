import {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {app} from '@clerotri/Generic';
import {Text} from '@clerotri/components/common/atoms';
import {Image} from '@clerotri/crossplat/Image';
import {client} from '@clerotri/lib/client';
import {DEFAULT_MAX_SIDE} from '@clerotri/lib/consts';
import {OrderedServersContext} from '@clerotri/lib/state';
import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';

export const ServerList = observer(
  ({
    onServerPress,
    onServerLongPress,
    filter,
    showUnread = true,
    showDiscover = true,
  }: {
    onServerPress: any;
    onServerLongPress?: any;
    filter?: any;
    showUnread?: boolean;
    showDiscover?: boolean;
  }) => {
    const {currentTheme} = useContext(ThemeContext);
    const localStyles = generateLocalStyles(currentTheme);

    const {orderedServers} = useContext(OrderedServersContext);

    let servers = [...client.servers.values()];
    if (filter) {
      servers = servers.filter(filter);
    }
    if (orderedServers.length > 0) {
      servers.sort((server1, server2) => {
        // get the positions of both servers in the synced list
        const s1index = orderedServers.indexOf(server1._id);
        const s2index = orderedServers.indexOf(server2._id);

        // if they're both in the list, subtract server 2's position from server 1's
        if (s1index > -1 && s2index > -1) {
          return (
            orderedServers.indexOf(server1._id) -
            orderedServers.indexOf(server2._id)
          );
        }

        // if server 1 isn't in the list and server 2 is, return 1 (server 2 then 1)
        if (s1index === -1 && s2index > -1) {
          return 1;
        }

        // if server 2 isn't in the list and server 1 is, return -1 (server 1 then 2)
        if (s2index === -1 && s1index > -1) {
          return -1;
        }

        // if both aren't in the list, convert the server IDs to timestamps then order them by when they were created
        return server2.createdAt > server1.createdAt ? -1 : 1;
      });
    }
    return (
      <View key={'server-list-container'}>
        {servers.map(s => {
          let iconURL = s.generateIconURL();
          let pings = s.getMentions().length;
          let initials = '';
          for (const word of s.name.split(' ')) {
            initials += word.charAt(0);
          }
          return (
            <View key={`${s._id}-indicator-container`}>
              <TouchableOpacity
                onPress={() => {
                  onServerPress(s);
                }}
                onLongPress={() => {
                  onServerLongPress(s);
                }}
                key={s._id}
                style={localStyles.serverButton}>
                {iconURL ? (
                  <Image
                    key={`${s._id}-icon`}
                    source={{uri: iconURL + '?max_side=' + DEFAULT_MAX_SIDE}}
                    style={localStyles.serverIcon}
                  />
                ) : (
                  <Text
                    key={`${s._id}-initials`}
                    style={localStyles.serverButtonInitials}>
                    {initials}
                  </Text>
                )}
              </TouchableOpacity>
              {showUnread && s.getMentions().length > 0 ? (
                <View
                  key={`${s._id}-mentions-indicator`}
                  style={localStyles.mentionsIndicator}>
                  <Text
                    key={`${s._id}-mentions-indicator-count`}
                    style={localStyles.mentionsIndicatorText}>
                    {pings > 9 ? '9+' : pings}
                  </Text>
                </View>
              ) : showUnread && s.isUnread() ? (
                <View
                  key={`${s._id}-unreads-indicator`}
                  style={localStyles.unreadsIndicator}
                />
              ) : null}
            </View>
          );
        })}
        {showDiscover ? (
          <>
            <View
              style={{
                margin: 6,
                height: 2,
                width: '80%',
                backgroundColor: currentTheme.backgroundPrimary,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                app.openChannel('discover');
              }}
              key={'serverlist-discover'}
              style={localStyles.serverButton}>
              <View style={{alignItems: 'center', marginVertical: '22.5%'}}>
                <MaterialCommunityIcon
                  name={'compass'}
                  size={25}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    );
  },
);
const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    serverButton: {
      borderRadius: 5000,
      width: 48,
      height: 48,
      margin: commonValues.sizes.small,
      backgroundColor: currentTheme.backgroundPrimary,
      overflow: 'hidden',
    },
    serverIcon: {
      width: 48,
      height: 48,
    },
    serverButtonInitials: {
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: '30%',
    },
    mentionsIndicator: {
      borderRadius: 10000,
      backgroundColor: currentTheme.error,
      height: 20,
      width: 20,
      marginBottom: -20,
      left: 36,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mentionsIndicatorText: {
      color: '#FFFFFF',
      marginRight: 1,
      marginBottom: 2,
    },
    unreadsIndicator: {
      borderRadius: 10000,
      borderWidth: 3,
      borderColor: currentTheme.background,
      backgroundColor: currentTheme.foregroundPrimary,
      height: 20,
      width: 20,
      marginBottom: -20,
      left: 36,
      position: 'absolute',
    },
  });
};
