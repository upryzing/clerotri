import {useContext, useState} from 'react';
import {
  type ColorValue,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import {StyleSheet, withUnistyles} from 'react-native-unistyles';

import {Drawer} from 'react-native-drawer-layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {Server} from 'revolt.js';

import {app, setFunction} from './Generic';
import {Avatar, Button} from './components/common/atoms';
import {MaterialCommunityIcon, MaterialIcon} from '@clerotri/components/common/icons';
import {ChannelList} from './components/navigation/ChannelList';
import {ServerList} from './components/navigation/ServerList';
import {ChannelView} from './components/views/ChannelView';
import {client} from '@clerotri/lib/client';
import {DEFAULT_API_URL} from '@clerotri/lib/consts';
import {
  ChannelContext,
  ServerContext,
  SideMenuContext,
} from '@clerotri/lib/state';
import {getInstanceURL} from '@clerotri/lib/storage/utils';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {useBackHandler} from '@clerotri/lib/ui';

// Unistyles doesn't seem to support experimental_backgroundImage, which is needed for the gradient,
// so work around this by passing the needed values as props
const ServerListGradientCore = ({
  colour,
  inset,
}: {
  colour: ColorValue;
  inset: number;
}) => {
  console.log(inset);
  return (
    <View
      style={[
        localStyles.serverListGradient,
        {
          experimental_backgroundImage: [
            {
              type: 'linear-gradient',
              colorStops: [{color: colour}, {color: `#00000000`}],
            },
          ],
          height: inset,
        },
      ]}
    />
  );
};

const ServerListGradient = withUnistyles(
  ServerListGradientCore,
  (currentTheme, rt) => ({
    colour: currentTheme.background,
    inset: rt.insets.top,
  }),
);

const SideMenu = () => {
  const insets = useSafeAreaInsets();

  const {currentTheme} = useContext(ThemeContext);

  const {setCurrentChannel} = useContext(ChannelContext);
  const {currentServer, setCurrentServer} = useContext(ServerContext);

  return (
    <View style={localStyles.container}>
      <View style={localStyles.sideView}>
        <ScrollView
          key={'server-list'}
          style={localStyles.serverList}
          contentContainerStyle={
            Platform.OS !== 'web' && {paddingTop: insets.top}
          }
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <Pressable
            onPress={() => {
              currentServer ? setCurrentServer(null) : app.openStatusMenu(true);
            }}
            onLongPress={() => {
              app.openProfile(client.user);
            }}
            delayLongPress={750}
            key={client.user?._id}
            style={{margin: 4}}>
            <Avatar
              key={`${client.user?._id}-avatar`}
              user={client.user}
              size={48}
              backgroundColor={currentTheme.backgroundSecondary}
              status
            />
          </Pressable>
          <View style={localStyles.separator} />
          <ServerList
            onServerPress={(s: Server) => setCurrentServer(s)}
            onServerLongPress={(s: Server) => app.openServerContextMenu(s)}
            showDiscover={getInstanceURL() === DEFAULT_API_URL}
          />
        </ScrollView>
        <ServerListGradient />
        <ChannelList />
      </View>
      <View style={localStyles.bottomBar}>
        <Button
          key={'bottom-nav-friends'}
          onPress={() => setCurrentChannel('friends')}
          backgroundColor={'#00000000'}
          style={{paddingVertical: 10}}>
          <MaterialIcon
            name="group"
            size={20}
          />
        </Button>
        <Button
          key={'bottom-nav-search'}
          onPress={() => app.openChannelSwitcher(true)}
          backgroundColor={'#00000000'}
          style={{paddingVertical: 10}}>
          <MaterialCommunityIcon
            name="text-search"
            size={20}
          />
        </Button>
        <Button
          key={'bottom-nav-settings'}
          onPress={() => app.openSettings(true)}
          backgroundColor={'#00000000'}
          style={{paddingVertical: 10}}>
          <MaterialIcon
            name="settings"
            size={20}
          />
        </Button>
      </View>
    </View>
  );
};

export const SideMenuHandler = () => {
  const {height, width} = useWindowDimensions();

  const localStyles = generateDrawerStyles(width);

  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  setFunction('openLeftMenu', (o: boolean) => {
    console.log(`[APP] Setting left menu open state to ${o}`);
    setSideMenuOpen(o);
  });

  useBackHandler(() => {
    if (height > width && !sideMenuOpen) {
      setSideMenuOpen(true);
      return true;
    }

    return false;
  });

  return (
    <SideMenuContext.Provider value={{sideMenuOpen, setSideMenuOpen}}>
      {height < width ? (
        <View style={localStyles.wide}>
          <View style={localStyles.wideInner}>
            <SideMenu />
          </View>
          <ChannelView />
        </View>
      ) : (
        <Drawer
          swipeEdgeWidth={width * 2}
          swipeMinVelocity={250}
          drawerType={'slide'}
          open={sideMenuOpen}
          onOpen={() => setSideMenuOpen(true)}
          onClose={() => setSideMenuOpen(false)}
          renderDrawerContent={() => <SideMenu />}
          style={localStyles.drawer}
          drawerStyle={localStyles.drawerInner}>
          <ChannelView />
        </Drawer>
      )}
    </SideMenuContext.Provider>
  );
};

const generateDrawerStyles = (width: number) => {
  return StyleSheet.create({
    drawer: {
      flex: 1,
    },
    drawerInner: {
      backgroundColor: '#00000000',
      width: width - 50,
    },
    wide: {
      flex: 1,
      flexDirection: 'row',
    },
    wideInner: {
      width: '20%',
      maxWidth: 350,
      flexDirection: 'column',
    },
  });
};

const localStyles = StyleSheet.create((currentTheme, rt) => ({
  container: {
    flex: 1,
    paddingBottom: rt.insets.bottom - 5,
  },
  sideView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  serverListGradient: {
    width: '100%',
    position: 'absolute',
  },
  serverList: {
    paddingInline: commonValues.sizes.small,
    flexShrink: 1,
    ...(Platform.OS === 'web' && {scrollbarWidth: 'none'}),
  },
  separator: {
    margin: 6,
    height: 2,
    width: '80%',
    backgroundColor: currentTheme.backgroundPrimary,
  },
  bottomBar: {
    height: 52,
    width: '100%',
    borderTopWidth: currentTheme.generalBorderWidth,
    borderColor: currentTheme.generalBorderColor,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
}));
