import {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import type {Client} from 'revolt.js';

import {Text} from './common/atoms';
import {commonValues} from '@clerotri/lib/themes';

export const NetworkIndicator = observer(({client}: {client: Client}) => {
  const {t} = useTranslation();

  const [collapsed, setCollapsed] = useState(false);

  if (!client.user?.online && client.user?.status?.presence && !collapsed) {
    return (
      <View style={localStyles.container}>
        <Text useNewText colour={'accentColor'} style={localStyles.text}>
          {t('app.misc.network_indicator.body')}
        </Text>
        <TouchableOpacity onPress={() => setCollapsed(true)}>
          <Text
            useNewText
            colour={'accentColor'}
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {t('app.misc.network_indicator.hide')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
});

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: rt.insets.top,
    width: '100%',
    height: rt.insets.top + 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: currentTheme.background,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginEnd: commonValues.sizes.small,
  },
}));
