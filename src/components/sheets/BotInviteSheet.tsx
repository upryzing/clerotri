import {useContext, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {API, Server} from 'revolt.js';

import {client} from '@clerotri/lib/client';
import {
  BackButton,
  Button,
  GeneralAvatar,
  Text,
} from '@clerotri/components/common/atoms';
import {ServerList} from '@clerotri/components/navigation/ServerList';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const BotInviteSheet = observer(
  ({setState, bot}: {setState: Function; bot: API.PublicBot}) => {
    const insets = useSafeAreaInsets();

    const {currentTheme} = useContext(ThemeContext);

    const [destination, setDestination] = useState(null as Server | null);

    return (
      <View
        style={{
          flex: 1,
          padding: commonValues.sizes.xl,
          paddingBlockStart: commonValues.sizes.xl + insets.top,
          paddingBlockEnd: commonValues.sizes.xl + insets.bottom,
          backgroundColor: currentTheme.backgroundPrimary,
        }}>
        <BackButton callback={() => setState()} type={'close'} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <GeneralAvatar
              directory={'/avatars/'}
              attachment={bot.avatar}
              size={48}
            />
            <Text style={{paddingLeft: 10, fontSize: 24, fontWeight: 'bold'}}>
              {bot.username}
            </Text>
          </View>
          <View style={{height: 64, marginBlock: commonValues.sizes.medium}}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{alignItems: 'center'}}>
              <ServerList
                onServerPress={(s: Server) => setDestination(s)}
                filter={(s: Server) => s.havePermission('ManageServer')}
                showUnread={false}
                showDiscover={false}
                horizontal
              />
            </ScrollView>
          </View>
          <Button
            style={{margin: 0}}
            disabled={!destination}
            onPress={() => {
              if (!destination) {
                return;
              }
              client.bots.invite(bot._id, {
                server: destination._id,
              });
              setState();
            }}>
            <Text>
              Invite to{' '}
              {destination ? (
                <Text style={{fontWeight: 'bold'}}>{destination?.name}</Text>
              ) : (
                'which server?'
              )}
            </Text>
          </Button>
        </View>
      </View>
    );
  },
);
