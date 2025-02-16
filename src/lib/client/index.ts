import {Client} from 'revolt.js';

import {DEFAULT_API_URL} from '@clerotri/lib/consts';
import {storage} from '@clerotri/lib/storage';

function getAPIURL() {
  let url: string = '';
  console.log('[AUTH] Getting API URL...');

  const instance = storage.getString('instanceURL');

  if (!instance) {
    console.log(
      '[AUTH] Unable to fetch instanceURL; setting apiURL to default',
    );
    url = DEFAULT_API_URL;
  } else {
    console.log(`[AUTH] Fetched instanceURL; setting apiURL to ${instance}`);
    url = instance;
  }
  return url;
}

const apiURL = getAPIURL();
console.log(`[AUTH] Creating client... (instance: ${apiURL})`);

export let client = new Client({
  unreads: true,
  apiURL: apiURL,
});
