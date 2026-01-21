import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {Channel, User} from 'revolt.js';

import {Text} from '@clerotri/components/common/atoms';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';
import {commonValues} from '@clerotri/lib/themes';

export const ChannelInfoSheet = observer(
  ({channel}: {channel: Channel | null}) => {
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
                useNewText
                colour={'foregroundSecondary'}
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
                <View style={localStyles.descriptionContainer}>
                  <MarkdownView style={localStyles.description}>
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

const localStyles = StyleSheet.create(currentTheme => ({
  descriptionContainer: {
    backgroundColor: currentTheme.background,
    padding: commonValues.sizes.medium,
    borderRadius: commonValues.sizes.medium,
  },
  description: {
    color: currentTheme.foregroundSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
}));
