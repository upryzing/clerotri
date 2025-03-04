import {useContext} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {app} from '@clerotri/Generic';
import {styles} from '@clerotri/Theme';
import {Text} from '@clerotri/components/common/atoms';
import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';

export const ChannelHeader = ({
  children,
  icon,
  name,
}: {
  children?: any;
  icon?: React.JSX.Element;
  name?: string;
}) => {
  const insets = useSafeAreaInsets();

  const {currentTheme} = useContext(ThemeContext);
  const localStyles = generateLocalStyles(currentTheme, insets.top);

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
            <MaterialIcon
              name="menu"
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </View>
        </TouchableOpacity>
      ) : null}
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      {name && <Text style={localStyles.channelName}>{name}</Text>}
      {children}
    </View>
  );
};

const generateLocalStyles = (currentTheme: Theme, inset: number) => {
  return StyleSheet.create({
    channelHeader: {
      backgroundColor: currentTheme.headerBackground,
      alignItems: 'center',
      paddingLeft: commonValues.sizes.xl,
      padding: 10,
      paddingTop: inset,
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
  });
};
