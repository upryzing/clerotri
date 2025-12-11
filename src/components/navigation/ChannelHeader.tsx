import {TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {app} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms';
import {MaterialIcon} from '@clerotri/components/common/icons';
import {commonValues} from '@clerotri/lib/themes';

export const ChannelHeader = ({
  children,
  icon,
  name,
}: {
  children?: any;
  icon?: React.JSX.Element;
  name?: string;
}) => {
  const {height, width} = useWindowDimensions();

  return (
    <View style={localStyles.channelHeader}>
      {height > width ? (
        <TouchableOpacity
          style={localStyles.headerIcon}
          onPress={() => {
            app.openLeftMenu(true);
          }}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="menu" size={20} />
          </View>
        </TouchableOpacity>
      ) : null}
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      {name && <Text style={localStyles.channelName}>{name}</Text>}
      {children}
    </View>
  );
};

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  channelHeader: {
    backgroundColor: currentTheme.headerBackground,
    alignItems: 'center',
    paddingInline: commonValues.sizes.xl,
    paddingBlock: commonValues.sizes.large,
    paddingTop: commonValues.sizes.large + rt.insets.top,
    flexDirection: 'row',
  },
  headerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelName: {
    flex: 1,
    fontWeight: 'bold',
  },
}));
