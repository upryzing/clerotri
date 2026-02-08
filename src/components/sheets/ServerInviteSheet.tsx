import {ImageBackground, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
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
    const {t} = useTranslation();

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
                    justifyContent: 'center',
                    marginBlockEnd: commonValues.sizes.xl,
                  }}>
                  <GeneralAvatar
                    attachment={server.server_icon?._id}
                    size={60}
                    directory={'/icons/'}
                  />

                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 26,
                      flexWrap: 'wrap',
                      marginBlock: commonValues.sizes.small,
                    }}>
                    {server?.server_name}
                  </Text>
                  <Text useNewText colour={'foregroundSecondary'}>
                    {t('app.invites.member_count', {
                      count: server.member_count,
                    })}
                  </Text>
                </View>
                <View style={localStyles.buttonsContainer}>
                  <Button
                    onPress={async () => {
                      !client.servers.get(server?.server_id) &&
                        (await client.joinInvite(inviteCode));
                      app.openServer(client.servers.get(server?.server_id));
                      app.openLeftMenu(true);
                      setState();
                    }}
                    style={localStyles.button}>
                    <Text useNewText style={{fontWeight: 'bold'}}>
                      {t(
                        `app.invites.${
                          client.servers.get(server?.server_id)
                            ? 'go_to_server'
                            : 'join_server'
                        }`,
                      )}
                    </Text>
                  </Button>
                  <Button onPress={() => setState()} style={localStyles.button}>
                    <Text>Back</Text>
                  </Button>
                </View>
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
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: commonValues.sizes.medium,
  },
  button: {
    width: '100%',
    margin: 0,
  },
  infoBox: {
    alignSelf: 'center',
    backgroundColor: currentTheme.backgroundSecondary + 'dd',
    padding: commonValues.sizes.large * 2,
    borderRadius: commonValues.sizes.medium,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
