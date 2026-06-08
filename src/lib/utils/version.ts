import {APP_VERSION} from '@clerotri/lib/metadata';
import {storage} from '@clerotri/lib/storage';

export function checkLastVersion() {
  const lastVersion = storage.getString('lastVersion');
  console.log(APP_VERSION, lastVersion);
  if (!lastVersion || lastVersion === '') {
    console.log(
      `[APP] lastVersion is null (${lastVersion}), setting to APP_VERSION (${APP_VERSION})`,
    );
    return null;
  } else if (APP_VERSION !== lastVersion) {
    console.log(
      `[APP] lastVersion (${lastVersion}) is different from APP_VERSION (${APP_VERSION})`,
    );
    return lastVersion;
  } else {
    console.log(
      `[APP] lastVersion (${lastVersion}) is equal to APP_VERSION (${APP_VERSION})`,
    );
    return 'current';
  }
}

type Version =
  `v${number}.${number}.${number}${`-${'alpha' | 'beta'}${number}` | ''}`;

/**
 * Check whether version A is newer than version B - for example, check if the last installed version is newer than a certain version before running a migration
 * @param version The version you want to check, formatted as `vX.Y.Z`
 * @param version2 The version you want to check it against, also formatted as `vX.Y.Z`
 * @returns `true` if version A is greater than version B, `false` if it isn't
 */
export const isVersionNewerThan = (version: Version, version2: Version) => {
  const split = version.replace('v', '').split('.');
  const split2 = version2.replace('v', '').split('.');

  const float = `${split[0]}.${split[1] + split[2] + (split[3] ? split[3].replace(/-(alpha|beta)/, '') : '')}`;
  const float2 = `${split2[0]}.${split2[1] + split2[2] + (split2[3] ? split2[3].replace(/-(alpha|beta)/, '') : '')}}`;

  return Number.parseFloat(float) > Number.parseFloat(float2);
};

// should be true: isVersionNewerThan('v0.1.2', 'v0.0.3-beta3')
