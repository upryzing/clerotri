import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {InputWithButtonV2, Text} from '@clerotri/components/common/atoms';
import {NewContextButton} from '@clerotri/components/common/buttons';
import {client} from '@clerotri/lib/client';
import {STATUSES} from '@clerotri/lib/consts';

export const StatusSheet = observer(() => {
  return (
    <View style={{paddingHorizontal: 16}}>
      <Text key={'custom-status-selector-label'} type={'h1'}>
        Status
      </Text>
      <View style={{marginBottom: 10}}>
        {STATUSES.map((s, i) => (
          <NewContextButton
            key={s}
            type={
              i === 0 ? 'start' : i === STATUSES.length - 1 ? 'end' : undefined
            }
            icon={{
              pack: 'regular',
              name: 'circle',
              colour: `status${s}`,
            }}
            textString={s}
            onPress={() => {
              client.users.edit({
                status: {...client.user?.status, presence: s},
              });
            }}
          />
        ))}
      </View>
      <Text key={'custom-status-input-label'} type={'h1'}>
        Status text
      </Text>
      <InputWithButtonV2
        inputProps={{
          placeholder: 'Custom status',
          defaultValue: client.user?.status?.text ?? undefined,
        }}
        buttonProps={{children: <Text>Set text</Text>}}
        callback={v => {
          client.users.edit({
            status: {
              ...client.user?.status,
              text: v ? v : undefined,
            },
          });
        }}
      />
    </View>
  );
});
