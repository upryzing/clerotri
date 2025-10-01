import {useContext, useMemo, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import MaterialIcon from '@react-native-vector-icons/material-icons';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {Message, User} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {
  Avatar,
  BackButton,
  Button,
  Input,
  Text,
  Username,
} from '@clerotri/components/common/atoms';
import {MarkdownView} from '@clerotri/components/common/MarkdownView';
import {OFFICIAL_INSTANCE_API_URLS, USER_IDS} from '@clerotri/lib/consts';
import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';
import type {ReportedObject} from '@clerotri/lib/types';
import {useBackHandler} from '@clerotri/lib/ui';

// these reasons are from revolt-api's types
const ContentReportReasons = [
  'Illegal',
  'IllegalGoods',
  'IllegalExtortion',
  'IllegalPornography',
  'IllegalHacking',
  'ExtremeViolence',
  'PromotesHarm',
  'UnsolicitedSpam',
  'Raid',
  'SpamAbuse',
  'ScamsFraud',
  'Malware',
  'Harassment',
  'NoneSpecified',
];

const UserReportReasons = [
  'UnsolicitedSpam',
  'SpamAbuse',
  'InappropriateProfile',
  'Impersonation',
  'BanEvasion',
  'Underage',
  'NoneSpecified',
];

type Status = {
  status: string;
  message?: string;
};

async function sendReport(
  reportObj: ReportedObject,
  reportReason: string,
  context?: string,
) {
  try {
    const body = {
      content: {
        type: reportObj.type,
        id: reportObj.object._id,
        report_reason: reportReason,
      },
      additional_context: context,
    };
    console.log(body);
    // @ts-expect-error typing mismatch that in practice won't arise
    await client.api.post('/safety/report', body);
    return {status: 'success'};
  } catch (e) {
    console.log(
      `[REPORT] Error reporting ${reportObj.type} ${reportObj.object._id}: ${e}`,
    );
    return {status: 'error', message: e as string};
  }
}

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
    input: {
      backgroundColor: currentTheme.backgroundPrimary,
      marginBlock: commonValues.sizes.small,
      padding: commonValues.sizes.large,
    },
  });
};

function Notice({
  stringKey,
  type,
}: {
  stringKey: string;
  type?: 'info' | 'warning' | 'error';
}) {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: commonValues.sizes.medium,
        borderRadius: commonValues.sizes.medium,
        backgroundColor: currentTheme.background,
        alignItems: 'center',
      }}>
      <MaterialIcon
        name={type ?? 'info'}
        size={28}
        color={
          type === 'error' ? currentTheme.error : currentTheme.foregroundPrimary
        }
      />
      <Text style={{flex: 1, marginInlineStart: commonValues.sizes.medium}}>
        {t(stringKey)}
      </Text>
    </View>
  );
}

const UserNextSteps = observer(
  ({user, type}: {user: User; type: 'Message' | 'User'}) => {
    const {currentTheme} = useContext(ThemeContext);

    const {t} = useTranslation();

    return (
      <>
        <Text>
          {t(
            `app.sheets.report.next_steps.block_${type === 'Message' ? 'message_author_body' : 'user_body'}`,
          )}
        </Text>
        <Button
          onPress={() => {
            user.blockUser();
          }}
          backgroundColor={
            user.relationship === 'Blocked'
              ? currentTheme.backgroundTertiary
              : currentTheme.error
          }
          disabled={user.relationship === 'Blocked'}
          style={{
            marginInline: 0,
            marginBlock: commonValues.sizes.small,
          }}>
          <Text
            colour={
              user.relationship === 'Blocked'
                ? currentTheme.foregroundSecondary
                : currentTheme.foregroundPrimary
            }>
            {t(
              `app.sheets.report.next_steps.${
                user.relationship === 'Blocked'
                  ? type === 'Message'
                    ? 'message_author_blocked'
                    : 'user_blocked'
                  : type === 'Message'
                    ? 'block_message_author'
                    : 'block_user'
              }`,
            )}
          </Text>
        </Button>
      </>
    );
  },
);

function SuccessScreen({reportedObject}: {reportedObject: ReportedObject}) {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  return (
    <>
      <Text style={{marginBlockEnd: commonValues.sizes.small}}>
        {t(
          `app.sheets.report.success_body_${
            client.apiURL === OFFICIAL_INSTANCE_API_URLS.stoat
              ? 'stoat'
              : client.apiURL === OFFICIAL_INSTANCE_API_URLS.upryzing
                ? 'upryzing'
                : 'generic'
          }`,
        )}
      </Text>
      <Text type={'h1'}>{t('app.sheets.report.next_steps.header')}</Text>
      {reportedObject.type === 'Message' || reportedObject.type === 'User' ? (
        <UserNextSteps
          user={
            reportedObject.type === 'Message'
              ? reportedObject.object.author!
              : reportedObject.object
          }
          type={reportedObject.type}
        />
      ) : (
        <>
          <Text>{t('app.sheets.report.next_steps.leave_server_body')}</Text>
          <Button
            backgroundColor={currentTheme.error}
            style={{
              marginInline: 0,
              marginBlock: commonValues.sizes.small,
            }}
            onPress={() => {
              reportedObject.object.delete(true);
            }}>
            <Text>{t('app.sheets.report.next_steps.leave_server')}</Text>
          </Button>
        </>
      )}
      <Button
        style={{
          marginInline: 0,
          marginBlock: commonValues.sizes.small,
        }}
        onPress={() => {
          app.openReportMenu(null);
        }}>
        <Text>{t('app.sheets.report.next_steps.done')}</Text>
      </Button>
    </>
  );
}

function ReasonsSelector({
  reportedObject,
  setReason,
}: {
  reportedObject: ReportedObject;
  setReason: Function;
}) {
  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const reasons =
    reportedObject.type === 'User' ? UserReportReasons : ContentReportReasons;

  return (
    <>
      <View style={{marginBlockEnd: commonValues.sizes.medium}}>
        <Text style={{fontWeight: 'bold'}}>
          {t(
            `app.sheets.report.reason_selector_${reportedObject.type.toLowerCase()}`,
          )}
        </Text>
        <Text>{t('app.sheets.report.reason_selector_body')}</Text>
        {reportedObject.type === 'Message' &&
        reportedObject.object.channel?.server ? (
          <View style={{marginBlockStart: commonValues.sizes.medium}}>
            <Notice
              stringKey={`app.sheets.report.destination_notice_${
                client.apiURL === OFFICIAL_INSTANCE_API_URLS.stoat
                  ? 'stoat'
                  : client.apiURL === OFFICIAL_INSTANCE_API_URLS.upryzing
                    ? 'upryzing'
                    : 'generic'
              }`}
              type={'warning'}
            />
          </View>
        ) : null}
      </View>
      {reasons.map(r => {
        return (
          <Button
            key={`reason_${r}`}
            style={{
              justifyContent: 'flex-start',
              marginInline: 0,
              marginBlock: commonValues.sizes.small,
            }}
            backgroundColor={currentTheme.backgroundPrimary}
            onPress={() => {
              setReason(r);
            }}>
            <View>
              <Text style={{fontWeight: 'bold'}}>
                {t(`app.sheets.report.reasons.${r}`)}
              </Text>
              <Text>
                {t(
                  `app.sheets.report.reasons.${r}_body${r === 'NoneSpecified' ? '' : `_${reportedObject.type.toLowerCase()}`}`,
                )}
              </Text>
            </View>
          </Button>
        );
      })}
    </>
  );
}

function ContextProvider({
  reportedObject,
  reason,
  setStatus,
}: {
  reportedObject: ReportedObject;
  reason: string;
  setStatus: Function;
}) {
  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme);

  const {t} = useTranslation();

  const [additionalContext, setAdditionalContext] = useState('');

  return (
    <>
      {reason && (
        <View
          style={{
            marginBlockEnd: commonValues.sizes.small,
            padding: commonValues.sizes.medium,
            borderRadius: commonValues.sizes.medium,
            backgroundColor: currentTheme.background,
          }}>
          <Text style={{fontWeight: 'bold'}}>
            {t(`app.sheets.report.reasons.${reason}`)}
          </Text>
          <Text>
            {t(
              `app.sheets.report.reasons.${reason}_body${reason === 'NoneSpecified' ? '' : `_${reportedObject.type.toLowerCase()}`}`,
            )}
          </Text>
        </View>
      )}
      <Text>{t('app.sheets.report.additional_context_body')}</Text>
      <Input
        skipRegularStyles
        style={localStyles.input}
        value={additionalContext}
        onChangeText={(c: string) => {
          setAdditionalContext(c);
        }}
        placeholder={t(
          `app.sheets.report.additional_context_placeholder${reason === 'NoneSpecified' ? '_recommended' : ''}`,
        )}
      />
      <Button
        onPress={async () =>
          setStatus(await sendReport(reportedObject, reason, additionalContext))
        }
        style={{
          backgroundColor: currentTheme.backgroundPrimary,
          marginInline: 0,
          marginBlock: commonValues.sizes.small,
        }}>
        <Text>
          {t(`app.sheets.report.report_${reportedObject.type.toLowerCase()}`)}
        </Text>
      </Button>
    </>
  );
}

const MessageDetails = observer(({msg}: {msg: Message}) => {
  const {height} = useWindowDimensions();

  const {currentTheme} = useContext(ThemeContext);

  const isLikelyBridged = useMemo(
    () => msg.author?._id === USER_IDS.automod && msg.masquerade !== null,
    [msg.author?._id, msg.masquerade],
  );

  return (
    <View
      style={{
        padding: commonValues.sizes.medium,
        borderRadius: commonValues.sizes.medium,
        backgroundColor: currentTheme.backgroundPrimary,
        marginBlockEnd: commonValues.sizes.medium,
      }}>
      <ScrollView
        style={{
          marginBottom: commonValues.sizes.small,
          maxHeight: (height / 100) * 30, // 30% of the window's height
        }}>
        <View style={{flexDirection: 'row'}}>
          <Avatar user={msg.author} server={msg.channel?.server} size={25} />
          <View
            style={{
              flexDirection: 'column',
              marginLeft: commonValues.sizes.small,
              width: '90%',
            }}>
            <Username
              user={msg.author!}
              server={msg.channel?.server}
              size={14}
            />
            {msg.content ? (
              <MarkdownView>{msg.content}</MarkdownView>
            ) : msg.attachments ? (
              <Text style={{color: currentTheme.foregroundSecondary}}>
                Sent an attachment
              </Text>
            ) : msg.embeds ? (
              <Text style={{color: currentTheme.foregroundSecondary}}>
                Sent an embed
              </Text>
            ) : (
              <Text style={{color: currentTheme.foregroundSecondary}}>
                No content
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      {isLikelyBridged && (
        <Notice stringKey={'app.sheets.report.bridged_message_notice'} />
      )}
    </View>
  );
});

export const ReportSheet = observer(
  ({object}: {object: ReportedObject | null}) => {
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState({} as Status);

    useBackHandler(() => {
      if (reason) {
        setReason('');
        return true;
      }

      return false;
    });

    const insets = useSafeAreaInsets();

    const {t} = useTranslation();

    return (
      <View style={{paddingHorizontal: 16, paddingBottom: insets.bottom}}>
        {object && (
          <>
            {reason && status.status !== 'success' && (
              <BackButton
                callback={() => setReason('')}
                style={{marginBottom: commonValues.sizes.medium}}
              />
            )}
            <Text type={'h1'}>
              {t(
                `app.sheets.report.${status.status !== 'success' ? `report_${object.type.toLowerCase()}` : 'success_header'}`,
              )}
            </Text>
            {object.type === 'Message' && (
              <MessageDetails msg={object.object} />
            )}
            {!reason && (
              <ReasonsSelector reportedObject={object} setReason={setReason} />
            )}
            {reason && !status.status && (
              <ContextProvider
                reportedObject={object}
                reason={reason}
                setStatus={setStatus}
              />
            )}
            {status.status === 'success' && (
              <SuccessScreen reportedObject={object} />
            )}
          </>
        )}
      </View>
    );
  },
);
