import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import {settings} from '@clerotri/lib/settings';
import {Text} from '@clerotri/components/common/atoms';
import {commonValues} from '@clerotri/lib/themes';
import {MessageProps} from '@clerotri/lib/types';

export const BlockedMessage = observer((props: MessageProps) => {
  return props.grouped ? null : (
    <View
      key={`message-${props.message._id}-blocked`}
      style={{
        marginTop: props.noTopMargin
          ? 0
          : (settings.get('ui.messaging.messageSpacing') as number),
      }}>
      <View
        key={`message-${props.message._id}-blocked-inner`}
        style={localStyles.innerBox}>
        <Text style={{marginLeft: 41}}>
          {props.groupedAfter ? 'Blocked messages' : 'Blocked message'}
        </Text>
      </View>
    </View>
  );
});

const localStyles = StyleSheet.create(currentTheme => ({
  innerBox: {
    backgroundColor: currentTheme.background,
    borderRadius: commonValues.sizes.small,
    padding: commonValues.sizes.medium,
  },
}));
