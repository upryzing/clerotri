import {useContext} from 'react';
import {Dimensions, Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {API} from 'revolt.js';

import {Image} from '@clerotri/crossplat/Image';
import {app} from '@clerotri/Generic';
import {settings} from '@clerotri/lib/settings';
import {client} from '@clerotri/lib/client';
import {MarkdownView} from '../MarkdownView';
import {Link, Text} from '../atoms';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const MessageEmbed = observer((eRaw: API.Embed) => {
  const {currentTheme} = useContext(ThemeContext);

  // @ts-expect-error This seems to be necessary even though it clashes with the API types
  const e = eRaw.embed;
  switch (e.type) {
    case 'Text':
    case 'Website':
      return (
        <View
          style={[
            localStyles.container,
            e.color && {borderStartColor: e.color},
          ]}>
          {e.type === 'Website' && e.site_name ? (
            <Text
              colour={currentTheme.foregroundSecondary}
              style={{fontSize: 12, marginBlockEnd: commonValues.sizes.xs}}>
              {e.site_name}
            </Text>
          ) : null}
          {e.title && e.url ? (
            <Link
              link={e.url}
              label={e.title}
              // style={{
              //   textDecorationLine: 'none',
              //   fontSize: 14,
              //   fontWeight: 'bold',
              //   marginBlockEnd: commonValues.sizes.small,
              // }}
            />
          ) : (
            <Text
              colour={currentTheme.foregroundSecondary}
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                marginBlockEnd: commonValues.sizes.small,
              }}>
              {e.title}
            </Text>
          )}
          {e.description ? <MarkdownView>{e.description}</MarkdownView> : null}
          {(() => {
            if (e.type === 'Website' && e.image) {
              let width = e.image.width;
              let height = e.image.height;
              if (width > Dimensions.get('screen').width - 82) {
                let sizeFactor = (Dimensions.get('screen').width - 82) / width;
                width = width * sizeFactor;
                height = height * sizeFactor;
              }
              return (
                <Pressable onPress={() => app.openImage(e.image?.url)}>
                  <Image
                    source={{uri: client.proxyFile(e.image.url)}}
                    style={{
                      width: width,
                      height: height,
                      marginBlock: commonValues.sizes.small,
                      borderRadius: commonValues.sizes.small,
                    }}
                  />
                </Pressable>
              );
            }
          })()}
        </View>
      );
    case 'Image':
      // if (e.image?.size === "Large") {}
      let width = e.width;
      let height = e.height;
      if (width > Dimensions.get('screen').width - 75) {
        let sizeFactor = (Dimensions.get('screen').width - 75) / width;
        width = width * sizeFactor;
        height = height * sizeFactor;
      }
      return (
        <Pressable onPress={() => app.openImage(client.proxyFile(e.url))}>
          <Image
            source={{uri: client.proxyFile(e.url)}}
            style={{
              width: width,
              height: height,
              marginBottom: commonValues.sizes.small,
              borderRadius: 3,
            }}
          />
        </Pressable>
      );
    case 'Video':
      return (
        <Text style={{fontSize: 8, marginLeft: 3}}>
          Video embeds are not currently supported
        </Text>
      );
    case 'None':
    default:
      console.log(`[MESSAGEEMBED] Unknown embed type: ${JSON.stringify(e)}`);
      return (settings.get('ui.showDeveloperFeatures') as boolean) ? (
        <Text>
          embed - type: {e.type === 'None' ? 'none' : (e.type ?? 'how')}, other
          info:
          {JSON.stringify(e)}
        </Text>
      ) : (
        <></>
      );
  }
});

const localStyles = StyleSheet.create(currentTheme => ({
  container: {
    marginBlock: commonValues.sizes.small,
    backgroundColor: currentTheme.backgroundSecondary,
    padding: commonValues.sizes.large,
    borderRadius: commonValues.sizes.medium,
    borderStartWidth: commonValues.sizes.small,
    borderStartColor: currentTheme.foregroundPrimary,
  },
}));
