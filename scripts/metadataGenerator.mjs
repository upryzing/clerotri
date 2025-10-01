import {exec} from 'child_process';
import {writeFile} from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

import packageData from '../package.json' with {type: 'json'};

const dir = fileURLToPath(import.meta.url);
const currentDir = path.dirname(dir);
const parentDir = path.dirname(currentDir);

const appVersion = packageData.version;
const rnVersion = packageData.dependencies['react-native'].replace('^', '');
const rvjsVersion = packageData.dependencies['revolt.js'].replace(
  'npm:@rexovolt/revolt.js@^',
  '',
);
let commitHash = 'PLACEHOLDER';

exec('git rev-parse HEAD', async (err, result) => {
  if (err) {
    throw new Error(err);
  }

  commitHash = result.replace('\n', '');

  const fileContents = `export const APP_VERSION = '${appVersion}';

export const REACT_NATIVE_VERSION = '${rnVersion}';

export const REVOLT_JS_VERSION = '${rvjsVersion}';

export const BUILD_COMMIT = '${commitHash}';
`;

  await writeFile(`${parentDir}/src/lib/metadata.ts`, fileContents);
});
