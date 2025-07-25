import {useContext} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {observer} from 'mobx-react-lite';

import {formatRelative} from 'date-fns/formatRelative';
import {enGB, enUS} from 'date-fns/locale';
import {decodeTime} from 'ulid';

import {app, settings} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {Avatar, Text, Username} from '@clerotri/components/common/atoms';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';
import {InviteEmbed} from '@clerotri/components/common/messaging/InviteEmbed';
import {MessageEmbed} from '@clerotri/components/common/messaging/MessageEmbed';
import {MessageReactions} from '@clerotri/components/common/messaging/MessageReactions';
import {ReplyMessage} from '@clerotri/components/common/messaging/ReplyMessage';
import {Image} from '@clerotri/crossplat/Image';
import {RE_INVITE} from '@clerotri/lib/consts';
import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';
import {MessageProps} from '@clerotri/lib/types';
import {
  getReadableFileSize,
  openUrl,
  parseRevoltNodes,
} from '@clerotri/lib/utils';

export const RegularMessage = observer((props: MessageProps) => {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  const locale = settings.get('ui.messaging.use24H') ? enGB : enUS;
  const mentionsUser = props.message.mention_ids?.includes(client.user?._id!);

  // check for invite links, then take the code from each
  const rawInvites = Array.from(
    props.message.content?.matchAll(RE_INVITE) ?? [],
  );
  let invites: string[] = [];
  for (const i of rawInvites) {
    invites.push(i[1]);
  }

  if (props.queued) {
    return (
      <Pressable
        key={`message-${props.message._id}-outer-pressable`}
        style={{opacity: 0.6}}
        delayLongPress={750}
        onLongPress={props.onLongPress}>
        <View
          style={{
            marginTop: settings.get('ui.messaging.messageSpacing') as number,
          }}
        />
        {props.message.reply_ids !== null ? (
          <View
            key={`message-${props.message._id}-replies`}
            style={localStyles.repliedMessagePreviews}>
            {props.message.reply_ids.map(id => (
              <ReplyMessage
                key={`message-${props.message._id}-reply-${id}`}
                message={client.messages.get(id)}
              />
            ))}
          </View>
        ) : null}
        <View
          style={
            props.grouped ? localStyles.messageGrouped : localStyles.message
          }>
          {!props.grouped ? (
            <Avatar
              key={`message-${props.message._id}-avatar-nongrouped`}
              user={client.user}
              masquerade={props.message.masquerade?.avatar ?? undefined}
              server={props.message.channel?.server}
              size={35}
              {...(settings.get('ui.messaging.statusInChatAvatars')
                ? {status: true}
                : {})}
            />
          ) : null}
          <View style={localStyles.messageInner}>
            {!props.grouped ? (
              <View style={{flexDirection: 'row'}}>
                <Username
                  user={client.user}
                  server={props.message.channel?.server}
                  masquerade={props.message.masquerade?.name}
                />
                <Text style={localStyles.timestamp}>
                  {' '}
                  {formatRelative(
                    decodeTime(props.message.nonce!),
                    new Date(),
                    {locale: locale},
                  )}
                </Text>
              </View>
            ) : null}
            <MarkdownView>{props.message.content}</MarkdownView>
          </View>
        </View>
      </Pressable>
    );
  }
  return (
    <TouchableOpacity
      key={props.message._id}
      activeOpacity={0.8}
      delayLongPress={750}
      onPress={props.onPress}
      onLongPress={props.onLongPress}>
      <View
        style={{
          marginTop:
            props.grouped || props.noTopMargin
              ? 0
              : (settings.get('ui.messaging.messageSpacing') as number),
        }}
      />

      {props.message.reply_ids !== null ? (
        <View style={localStyles.repliedMessagePreviews}>
          {props.message.reply_ids.map(id => (
            <ReplyMessage
              key={id}
              message={client.messages.get(id)}
              mention={props.message?.mention_ids?.includes(
                props.message?.author_id,
              )}
              showSymbol={true}
            />
          ))}
        </View>
      ) : null}
      <View
        style={{
          ...localStyles.message,
          ...(props.grouped
            ? localStyles.messageGrouped
            : localStyles.messageUngrouped),
          ...(mentionsUser
            ? {
                borderColor: currentTheme.mentionBorder,
                backgroundColor: currentTheme.mentionBackground,
              }
            : null),
        }}>
        {props.message.author && !props.grouped ? (
          <Pressable
            key={`message-${props.message._id}-avatar`}
            style={{height: 0}}
            onPress={() => props.onUserPress()}>
            <Avatar
              user={props.message.author}
              masquerade={props.message.generateMasqAvatarURL()}
              server={props.message.channel?.server}
              size={35}
              {...(settings.get('ui.messaging.statusInChatAvatars')
                ? {status: true}
                : {})}
            />
          </Pressable>
        ) : null}
        <View
          key={`message-${props.message._id}-inner`}
          style={localStyles.messageInner}>
          {props.grouped && props.message.edited ? (
            <Text
              key={`message-${props.message._id}-edited`}
              colour={currentTheme.foregroundTertiary}
              style={{
                fontSize: 11,
                position: 'relative',
                right: 49,
                marginBottom: -16,
              }}>
              {' '}
              (edited)
            </Text>
          ) : null}
          {props.message.author && !props.grouped ? (
            <View
              key={`message-${props.message._id}-info-row`}
              style={{flexDirection: 'row'}}>
              <Pressable
                key={`message-${props.message._id}-username-pressable`}
                onPress={props.onUsernamePress}>
                <Username
                  key={`message-${props.message._id}-username`}
                  user={props.message.author}
                  server={props.message.channel?.server}
                  masquerade={props.message.masquerade?.name}
                />
              </Pressable>
              <Text
                key={`message-${props.message._id}-timestamp`}
                style={localStyles.timestamp}>
                {' '}
                {formatRelative(props.message.createdAt, new Date(), {
                  locale: locale,
                })}
              </Text>
              {props.message.edited && (
                <Text
                  key={`message-${props.message._id}-edited`}
                  colour={currentTheme.foregroundTertiary}
                  style={{
                    fontSize: 12,
                    position: 'relative',
                    top: 2,
                    left: 2,
                  }}>
                  {' '}
                  (edited)
                </Text>
              )}
            </View>
          ) : null}
          {props.message.content ? (
            <MarkdownView key={`message-${props.message._id}-rendered-content`}>
              {parseRevoltNodes(props.message.content)}
            </MarkdownView>
          ) : null}
          {props.message.attachments?.map(a => {
            if (a.metadata?.type === 'Image') {
              let width = a.metadata.width;
              let height = a.metadata.height;

              if (width > Dimensions.get('screen').width - 75) {
                const sizeFactor =
                  (Dimensions.get('screen').width - 75) / width;
                width = width * sizeFactor;
                height = height * sizeFactor;
              }

              const imageURL = client.generateFileURL(a);

              return (
                <Pressable
                  key={`message-${props.message._id}-image-${a._id}`}
                  onPress={() => app.openImage(a)}>
                  <Image
                    source={{uri: imageURL}}
                    resizeMode={'contain'}
                    style={{
                      width: width,
                      height: height,
                      marginBottom: commonValues.sizes.small,
                      borderRadius: 3,
                    }}
                  />
                </Pressable>
              );
            } else {
              return (
                <Pressable
                  key={`message-${props.message._id}-attachment-${a._id}`}
                  onPress={() => openUrl(client.generateFileURL(a)!)}>
                  <View
                    style={{
                      padding: commonValues.sizes.large,
                      borderRadius: commonValues.sizes.small,
                      backgroundColor: currentTheme.backgroundSecondary,
                      marginBottom: commonValues.sizes.small,
                    }}>
                    <Text style={{fontWeight: 'bold'}}>{a.filename}</Text>
                    <Text>{getReadableFileSize(a.size)}</Text>
                  </View>
                </Pressable>
              );
            }
          })}
          {invites?.map((inv, index) => {
            return (
              <InviteEmbed
                key={`message-${props.message._id}-invite-${inv}-${index}`}
                message={props.message}
                invite={inv}
              />
            );
          })}
          {props.message.embeds &&
            props.message.embeds.map((e, i) => {
              return (
                <MessageEmbed
                  key={`message-${props.message._id}-embed-${i}`}
                  embed={e}
                />
              );
            })}
          {settings.get('ui.messaging.showReactions') ? (
            <MessageReactions msg={props.message} />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    message: {
      borderRadius: commonValues.sizes.small,
      borderLeftWidth: 3,
      borderStyle: 'solid',
      borderColor: '#00000000',
      width: '100%',
    },
    messageUngrouped: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: commonValues.sizes.xs,
      paddingHorizontal: commonValues.sizes.xs,
    },
    messageGrouped: {
      paddingLeft: 37,
      paddingVertical: commonValues.sizes.xs,
    },
    messageGroupedAfter: {
      borderRadius: 0,
    },
    messageInner: {
      flex: 1,
      paddingLeft: 10,
    },
    timestamp: {
      fontSize: 12,
      color: currentTheme.foregroundTertiary,
      position: 'relative',
      top: 2,
      left: 2,
    },
    repliedMessagePreviews: {
      paddingTop: commonValues.sizes.small,
    },
  });
};
