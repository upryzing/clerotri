import {type RefObject, useLayoutEffect, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import type {API} from 'revolt.js';

import {Image} from '@clerotri/crossplat/Image';
import {app} from '@clerotri/Generic';
import {settings} from '@clerotri/lib/settings';
import {client} from '@clerotri/lib/client';
import {MarkdownView} from '../MarkdownView';
import {Link, Text} from '../atoms';
import {commonValues} from '@clerotri/lib/themes';

const calculateImageDimensions = (
  containerRef: RefObject<View | null>,
  image: {width: number; height: number},
) => {
  const {width} = containerRef.current?.getBoundingClientRect() ?? {
    width: 0,
  };

  let finalImageWidth = image.width;
  let finalImageHeight = image.width;

  if (image.width > width) {
    let sizeFactor = width / image.width;
    console.log(sizeFactor, width, image.width, image.width * sizeFactor);
    finalImageWidth = image.width * sizeFactor;
    finalImageHeight = image.height * sizeFactor;
  }

  return {width: finalImageWidth, height: finalImageHeight};
};

const EmbedImage = ({embed}: {embed: API.Embed}) => {
  const containerRef = useRef<View>(null);

  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({width: 0, height: 0});

  useLayoutEffect(() => {
    // this component won't run at all if there isn't an embed image so this is just for the sake of TS
    if (embed.type !== 'Website' && embed.type !== 'Image') return;

    const dimensions = calculateImageDimensions(
      containerRef,
      embed.type === 'Image' ? embed : embed.image || {width: 0, height: 0},
    );

    setImageDimensions(dimensions);
  }, [embed]);

  if (embed.type !== 'Website' && embed.type !== 'Image') return null;

  if (embed.type !== 'Image' && !embed.image) return null;

  return (
    <Pressable
      ref={containerRef}
      onPress={() => app.openImage(embed.type === 'Image' ? embed.url : embed.image?.url)}>
      <Image
        source={{uri: client.proxyFile(embed.type === 'Image' ? embed.url : embed.image?.url || '')}}
        style={[
          {
            marginBlockStart: commonValues.sizes.medium,
            borderRadius: commonValues.sizes.small,
          },
          imageDimensions,
        ]}
      />
    </Pressable>
  );
};

export const MessageEmbed = observer(({embed}: {embed: API.Embed}) => {
  switch (embed.type) {
    case 'Text':
    case 'Website':
      return (
        <View
          style={[
            localStyles.container,
            // @ts-expect-error I think the U-less spelling was used at one point? it doesn't hurt to check for it
            embed.color && {borderStartColor: embed.color},
            embed.colour && {borderStartColor: embed.colour},
          ]}>
          {embed.type === 'Website' && embed.site_name ? (
            <Text
              useNewText
              colour={'foregroundSecondary'}
              style={{fontSize: 12, marginBlockEnd: commonValues.sizes.xs}}>
              {embed.site_name}
            </Text>
          ) : null}
          {embed.title && embed.url ? (
            <Link link={embed.url} label={embed.title} />
          ) : (
            <Text
              useNewText
              colour={'foregroundSecondary'}
              style={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              {embed.title}
            </Text>
          )}
          {embed.description ? (
            <View style={{marginBlockStart: commonValues.sizes.medium}}>
              <MarkdownView>{embed.description}</MarkdownView>
            </View>
          ) : null}
          {embed.type === 'Website' && embed.image ? (
            <EmbedImage embed={embed} />
          ) : null}
        </View>
      );
    case 'Image':
      return <EmbedImage embed={embed} /> 
    case 'Video':
      return (
        <Text style={{fontSize: 8, marginLeft: 3}}>
          Video embeds are not currently supported
        </Text>
      );
    case 'None':
    default:
      console.log(
        `[MESSAGEEMBED] Unknown embed type: ${JSON.stringify(embed)}`,
      );
      return (settings.get('ui.showDeveloperFeatures') as boolean) ? (
        <Text>
          embed - type:{' '}
          {embed.type === 'None'
            ? 'none'
            : // @ts-expect-error I'm not sure if something changed but I swear the type could've been None
              (embed.type ?? 'how')}
          , other info:
          {JSON.stringify(embed)}
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
