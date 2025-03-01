import {useContext} from 'react';
import {Dimensions, Pressable, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import type {API} from 'revolt.js';

import {Image} from '@clerotri/crossplat/Image';
import {app, settings} from '@clerotri/Generic';
import {client} from '@clerotri/lib/client';
import {MarkdownView} from '../MarkdownView';
import {Link, Text} from '../atoms';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';

export const MessageEmbed = observer((eRaw: API.Embed) => {
  const {currentTheme} = useContext(ThemeContext);

  // @ts-expect-error This seems to be necessary even though it clashses with the API types
  const e = eRaw.embed;
  switch (e.type) {
    case 'Text':
    case 'Website':
      return (
        <View
          style={{
            marginTop: commonValues.sizes.small,
            backgroundColor: currentTheme.backgroundSecondary,
            padding: commonValues.sizes.medium,
            borderRadius: commonValues.sizes.medium,
            borderStartWidth: commonValues.sizes.small,
            borderStartColor: e.colour ?? undefined,
          }}>
          {e.type === 'Website' && e.site_name ? (
            <Text
              colour={currentTheme.foregroundSecondary}
              style={{fontSize: 12}}>
              {e.site_name}
            </Text>
          ) : null}
          {e.title && e.url ? (
            <Link
              link={e.url}
              label={e.title}
              style={{textDecorationLine: 'none', fontSize: 14}}
            />
          ) : (
            <Text
              colour={currentTheme.foregroundSecondary}
              style={{
                fontSize: 14,
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
                      marginTop: commonValues.sizes.small,
                      borderRadius: 3,
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
