import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {PressableSettingsEntry} from '@clerotri/components/common/settings/atoms';
import {SettingsCategory} from '@clerotri/components/common/settings/SettingsCategory';
import {LineSeparator} from '@clerotri/components/layout';
import {PRIVACY_INFO} from '@clerotri/lib/consts';
import {commonValues} from '@clerotri/lib/themes';
import {openUrl} from '@clerotri/lib/utils';

export const PrivacySettingsSection = observer(() => {
  return (
    <>
      <SettingsCategory category={'privacy'} />
      <LineSeparator style={{margin: commonValues.sizes.medium}} />
      <PressableSettingsEntry
        key={'privacy-info'}
        onPress={() => openUrl(PRIVACY_INFO)}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <Text style={{fontWeight: 'bold'}}>Privacy information</Text>
          <Text>Find out more about about how Clerotri handles your data</Text>
        </View>
        <View style={styles.iconContainer}>
          <MaterialIcon name="arrow-forward" size={20} />
        </View>
      </PressableSettingsEntry>
    </>
  );
});
