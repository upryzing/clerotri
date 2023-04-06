import {View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import {
  ChannelList,
  ServerList,
  app,
  setFunction,
  client,
  Text,
  MarkdownView,
  Button,
} from './Generic';
import {MiniProfile, Avatar} from './Profile';
import {styles, currentTheme} from './Theme';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {User} from 'revolt.js';

export class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentServer: null,
      rerender: 0,
    };
    setFunction('openServer', s => {
      this.setState({currentServer: s});
    });
  }
  render() {
    return (
      <>
        <View style={styles.leftView}>
          <ScrollView key={'server-list'} style={styles.serverList}>
            <TouchableOpacity
              onPress={() => {
                this.state.currentServer
                  ? this.setState({
                      currentServer: null,
                      contextMenuUserServer: null,
                    })
                  : app.openStatusMenu(true);
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
            </TouchableOpacity>
            <View
              style={{
                margin: 6,
                height: 2,
                width: '80%',
                backgroundColor: currentTheme.backgroundPrimary,
              }}
            />
            <ServerList
              onServerPress={(s: Server) => this.setState({currentServer: s})}
              onServerLongPress={(s: Server) => app.openServerContextMenu(s)}
            />
          </ScrollView>
          <ScrollView key={'channel-list'} style={styles.channelList}>
            <ChannelList
              onChannelClick={this.props.onChannelClick}
              currentChannel={this.props.currentChannel}
              currentServer={this.state.currentServer}
            />
          </ScrollView>
        </View>
        <View
          style={{
            height: 50,
            width: '100%',
            backgroundColor: currentTheme.backgroundSecondary,
            borderTopWidth: currentTheme.generalBorderWidth,
            borderColor: currentTheme.generalBorderColor,
            flexDirection: 'row',
          }}>
          <Button
            key={'bottom-nav-friends'}
            onPress={() => this.props.onChannelClick('friends')}
            backgroundColor={currentTheme.backgroundPrimary}>
            <MaterialIcon
              name="group"
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </Button>
          <Button
            key={'bottom-nav-settings'}
            onPress={() => app.openSettings(true)}
            backgroundColor={currentTheme.backgroundPrimary}>
            <FAIcon
              name="gear"
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </Button>
          <Button
            key={'bottom-nav-logout'}
            onPress={this.props.onLogOut}
            backgroundColor={currentTheme.backgroundPrimary}>
            <MaterialIcon
              name="logout"
              size={20}
              color={currentTheme.foregroundPrimary}
            />
          </Button>
        </View>
      </>
    );
  }
}
export class RightMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderMember = this.renderMember.bind(this);
  }
  render() {
    if (
      this.props.currentChannel?.channel_type === 'Group' ||
      this.props.currentChannel?.channel_type === 'DirectMessage'
    ) {
      return (
        <View style={styles.rightView}>
          {this.props.currentChannel?.recipients?.map((u: User) => (
            <Button
              backgroundColor={currentTheme.backgroundPrimary}
              style={{
                margin: 6,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
              onPress={() => app.openProfile(u)}>
              <View style={{maxWidth: '90%'}}>
                <MiniProfile user={u} />
              </View>
            </Button>
          ))}
        </View>
      );
    }
    if (this.props.currentChannel?.server) {
      return (
        <View style={styles.rightView}>
          <View
            style={{
              margin: 10,
              padding: 10,
              backgroundColor: currentTheme.backgroundPrimary,
              borderRadius: 8,
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              #{this.props.currentChannel?.name}
            </Text>
            {this.props.currentChannel?.description ? (
              <MarkdownView>
                {this.props.currentChannel?.description}
              </MarkdownView>
            ) : null}
          </View>
          {/* <FlatList style={{flex: 1}}
                data={[...client.members.keys()]}
                renderItem={this.renderMember}
                keyExtractor={(item) => item}
                /> */}
        </View>
      );
    }
  }
  renderMember({item}) {
    let obj = JSON.parse(item);
    if (obj.server === this.props.currentChannel?.server._id) {
      let u = client.users.get(obj.user);
      if (u) {
        return (
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              marginLeft: 6,
              marginRight: 6,
              marginTop: 3,
              padding: 6,
              backgroundColor: currentTheme.backgroundPrimary,
              borderRadius: 8,
            }}
            onPress={() => app.openProfile(u)}>
            <MiniProfile user={u} server={this.props.currentChannel?.server} />
          </TouchableOpacity>
        );
      }
    }
  }
}
