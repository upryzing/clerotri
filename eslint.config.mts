import {defineConfig, globalIgnores} from 'eslint/config';

/* @ts-expect-error seemingly untyped but functional */
import reactNativeConfig from '@react-native/eslint-config/flat';

import deMorganConfig from 'eslint-plugin-de-morgan';

export default defineConfig([
  globalIgnores(['.yarn', 'dist', 'external/analytics-server/vendored']),
  ...reactNativeConfig.filter(
    // ft-flow is not compatible with flat config
    (config: any) => config.plugins?.['ft-flow'] === undefined,
  ),
  deMorganConfig.configs.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 0,
      'react-native/no-inline-styles': 0, // TODO: turn this back on when the codebase is less error-filled
      'require-await': 1,
    },
  },
]);
