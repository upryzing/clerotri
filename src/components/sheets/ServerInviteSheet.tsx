import {ImageBackground, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {API} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {Button, GeneralAvatar, Text} from '@clerotri/components/common/atoms';
import {commonValues} from '@clerotri/lib/themes';

export const ServerInviteSheet = observer(
  ({
    setState,
    server,
    inviteCode,
  }: {
    setState: Function;
    server: API.InviteResponse;
    inviteCode: string;
  }) => {
    return (
      <View style={localStyles.container}>
        <ImageBackground
          src={
            server.type === 'Server' && server?.server_banner
              ? client.generateFileURL(server.server_banner)
              : ''
          }
          style={localStyles.banner}>
          {server?.type === 'Server' ? (
            <View
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                top: 0,
                left: 0,
                flex: 1,
                justifyContent: 'center',
              }}>
              <View style={[localStyles.infoBox]}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginBlockEnd: commonValues.sizes.xl,
                  }}>
                  <GeneralAvatar
                    attachment={server.server_icon?._id}
                    size={60}
                    directory={'/icons/'}
                  />
                  <View
                    style={{
                      marginStart: commonValues.sizes.large,
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 26,
                        flexWrap: 'wrap',
                      }}>
                      {server?.server_name}
                    </Text>
                    <Text useNewText colour={'foregroundSecondary'} style={{}}>
                      {server?.member_count}{' '}
                      {server?.member_count === 1 ? 'member' : 'members'}
                    </Text>
                  </View>
                </View>
                <Button
                  onPress={async () => {
                    !client.servers.get(server?.server_id) &&
                      (await client.joinInvite(inviteCode));
                    app.openServer(client.servers.get(server?.server_id));
                    app.openLeftMenu(true);
                    setState();
                  }}
                  style={localStyles.button}>
                  <Text useNewText>
                    {client.servers.get(server?.server_id)
                      ? 'Go to Server'
                      : 'Join Server'}
                  </Text>
                </Button>
                <Button
                  onPress={() => setState()}
                  style={localStyles.button}>
                  <Text>Back</Text>
                </Button>
              </View>
            </View>
          ) : (
            <Text>{server?.toString()}</Text>
          )}
        </ImageBackground>
      </View>
    );
  },
);

const localStyles = StyleSheet.create(currentTheme => ({
  container: {
    flex: 1,
    backgroundColor: currentTheme.backgroundPrimary,
  },
  banner: {
    flex: 1,
  },
  button: {
    width: '90%',
  },
  infoBox: {
    alignSelf: 'center',
    backgroundColor: currentTheme.backgroundSecondary + 'dd',
    padding: commonValues.sizes.xl,
    borderRadius: commonValues.sizes.medium,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
