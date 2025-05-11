import {useContext} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {client} from '@clerotri/lib/client';
import {ContextButton, InputWithButtonV2, Text} from '../common/atoms';
import {STATUSES} from '@clerotri/lib/consts';
import {ThemeContext} from '@clerotri/lib/themes';

export const StatusSheet = observer(() => {
  const {currentTheme} = useContext(ThemeContext);

  return (
    <View style={{paddingHorizontal: 16}}>
      <Text key={'custom-status-selector-label'} type={'h1'}>
        Status
      </Text>
      <View style={{marginBottom: 10}}>
        {STATUSES.map(s => (
          <ContextButton
            key={s}
            onPress={() => {
              client.users.edit({
                status: {...client.user?.status, presence: s},
              });
            }}>
            <View
              style={{
                backgroundColor: currentTheme[`status${s}`],
                height: 16,
                width: 16,
                borderRadius: 10000,
                marginRight: 10,
              }}
            />
            <Text style={{fontSize: 15}} key={`${s}-button-label`}>
              {s}
            </Text>
          </ContextButton>
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
