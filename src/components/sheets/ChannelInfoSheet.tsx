import {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type {Channel, User} from 'revolt.js';

import {Text} from '@clerotri/components/common/atoms';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const ChannelInfoSheet = observer(
  ({channel}: {channel: Channel | null}) => {
    const {currentTheme} = useContext(ThemeContext);

    const [groupMembers, setGroupMembers] = useState([] as User[]);

    useEffect(() => {
      async function fetchMembers() {
        if (!channel) {
          return;
        }
        const m =
          channel.channel_type === 'Group' ? await channel.fetchMembers() : [];
        setGroupMembers(m);
      }
      fetchMembers();
    }, [channel]);
    return (
      <View style={{paddingHorizontal: commonValues.sizes.xl}}>
        {!channel ? (
          <></>
        ) : (
          <>
            <View style={{justifyContent: 'center'}}>
              <Text type={'h1'}>{channel.name}</Text>
              <Text
                colour={currentTheme.foregroundSecondary}
                style={{
                  marginVertical: commonValues.sizes.small,
                }}>
                {channel.channel_type === 'Group'
                  ? `Group (${groupMembers.length} ${
                      groupMembers.length === 1 ? 'member' : 'members'
                    })`
                  : 'Regular channel'}
              </Text>
              {channel.description ? (
                <View
                  style={{
                    backgroundColor: currentTheme.background,
                    padding: commonValues.sizes.medium,
                    borderRadius: commonValues.sizes.medium,
                  }}>
                  <MarkdownView
                    style={{
                      color: currentTheme.foregroundSecondary,
                      fontSize: 16,
                      textAlign: 'center',
                    }}>
                    {channel.description}
                  </MarkdownView>
                </View>
              ) : null}
            </View>
          </>
        )}
      </View>
    );
  },
);
