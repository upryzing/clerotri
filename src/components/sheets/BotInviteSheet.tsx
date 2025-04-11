import {useContext, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {Server, User} from 'revolt.js';

import {client} from '@clerotri/lib/client';
import {Button, GeneralAvatar, Text} from '@clerotri/components/common/atoms';
import {ServerList} from '@clerotri/components/navigation/ServerList';
import {ThemeContext} from '@clerotri/lib/themes';

export const BotInviteSheet = observer(
  ({setState, bot}: {setState: Function; bot: User}) => {
    const insets = useSafeAreaInsets();

    const {currentTheme} = useContext(ThemeContext);

    const [destination, setDestination] = useState(null as Server | null);

    return (
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: currentTheme.backgroundPrimary,
        }}>
        <Pressable
          onPress={() => {
            setState();
          }}>
          <Text style={{fontSize: 24}}>Cancel</Text>
        </Pressable>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <GeneralAvatar attachment={bot.avatar} size={48} />
            <Text style={{paddingLeft: 10, fontSize: 24, fontWeight: 'bold'}}>
              {bot.username}
            </Text>
          </View>
          <View style={{height: 56}}>
            <ScrollView horizontal={true}>
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
