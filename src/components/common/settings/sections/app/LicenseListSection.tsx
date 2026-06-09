import {useEffect, useState} from 'react';
import {Platform, Pressable, SectionList, View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {styles} from '@clerotri/Theme';
import {Link, Text} from '@clerotri/components/common/atoms';
import {MaterialCommunityIcon} from '@clerotri/components/common/icons';
import {openUrl} from '@clerotri/lib/utils';
import {commonValues} from '@clerotri/lib/themes';

import licenseList from '../../../../../../assets/data/licenses.json';

type Package = {
  name: string;
  version: string;
  url?: string;
  vendorName?: string;
  vendorUrl?: string;
};

interface SectionListLicenses {
  title: string;
  data: Package[];
}

const PackageEntry = ({packageInfo}: {packageInfo: Package}) => {
  return (
    <View
      key={`license-list-license-${packageInfo.name}`}
      style={localStyles.packageEntry}>
      <View style={{flex: 1}}>
        <Text>
          <Text style={{fontWeight: 'bold'}}>{packageInfo.name}</Text>
          <Text useNewText colour={'foregroundSecondary'}>
            {' '}
            v{packageInfo.version}
          </Text>
        </Text>
        {packageInfo.vendorName ? (
          <Text useNewText colour={'foregroundSecondary'}>
            by{' '}
            {packageInfo.vendorUrl ? (
              <Link
                link={packageInfo.vendorUrl}
                label={packageInfo.vendorName}
              />
            ) : (
              packageInfo.vendorName
            )}
          </Text>
        ) : null}
      </View>
      {packageInfo.url ? (
        <Pressable
          onPress={() =>
            // @ts-expect-error there's a null check literally right above this???
            openUrl(packageInfo.url)
          }>
          <MaterialCommunityIcon name={'open-in-new'} size={28} />
        </Pressable>
      ) : (
        <View />
      )}
    </View>
  );
};

export const LicenseListSection = () => {
  const insets = useSafeAreaInsets();

  const {t} = useTranslation();

  const [data, setData] = useState<SectionListLicenses[] | null>(null);

  const renderItem = ({item}: {item: Package}) => {
    return <PackageEntry packageInfo={item} />;
  };

  const renderHeader = ({section: {title}}: {section: {title: string}}) => {
    return (
      <View style={localStyles.header}>
        <Text type={'h2'}>{title}</Text>
      </View>
    );
  };

  const keyExtractor = (item: Package) => {
    return `license-list-entry-${item.name}-${item.version}`;
  };

  useEffect(() => {
    function prepareData() {
      const newData: SectionListLicenses[] = [];

      licenseList.forEach(license => {
        newData.push({title: license.license, data: license.packages});
      });

      setData(newData);
    }

    prepareData();
  }, []);

  return (
    <View style={{flex: 1}}>
      {data ? (
        <SectionList
          key={'license-list-sectionlist'}
          keyExtractor={keyExtractor}
          sections={data}
          style={{flex: 1}}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'web' ? 0 : insets.bottom,
          }}
          renderSectionHeader={renderHeader}
          renderItem={renderItem}
          stickySectionHeadersEnabled
        />
      ) : (
        <View style={styles.loadingScreen}>
          <Text type={'h1'}>{t('app.settings_menu.licenses.loading')}</Text>
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  header: {
    backgroundColor: currentTheme.backgroundPrimary,
  },
  packageEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: commonValues.sizes.medium,
    borderRadius: commonValues.sizes.small,
    padding: commonValues.sizes.medium,
    backgroundColor: currentTheme.backgroundSecondary,
  },
}));
