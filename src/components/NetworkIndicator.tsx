import {useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {Client} from 'revolt.js';

import {Text} from './common/atoms';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const NetworkIndicator = observer(({client}: {client: Client}) => {
  const insets = useSafeAreaInsets();

  const {currentTheme} = useContext(ThemeContext);

  const {t} = useTranslation();

  const [collapsed, setCollapsed] = useState(false);
  if (!client.user?.online && client.user?.status?.presence && !collapsed) {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          paddingTop: insets.top,
          width: '100%',
          height: insets.top + 54,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: currentTheme.background,
          flexDirection: 'row',
        }}>
        <Text
          colour={currentTheme.accentColor}
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            marginEnd: commonValues.sizes.small,
          }}>
          {t('app.misc.network_indicator.body')}
        </Text>
        <TouchableOpacity onPress={() => setCollapsed(true)}>
          <Text
            colour={currentTheme.accentColor}
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
  return <></>;
});
