import {storage} from '@clerotri/lib/storage';
import {
  type CustomTheme,
  type CustomThemeCollection,
  type Theme,
  themes,
} from './data';

export const getCustomTheme = (key: string) => {
  const customThemes = getCustomThemeCollection();

  if (!customThemes || !customThemes[key]) return undefined;

  return customThemes[key];
};

export const getCustomThemeCollection = () => {
  const customThemes =
    storage.getString('customThemes') ??
    '{"ulid": {"name": "Dark-Magenta", "base": "Dark", "data": {"accentColor": "magenta"}}}'; //'{}';
  const parsedThemesObject = JSON.parse(customThemes) as CustomThemeCollection;
  return parsedThemesObject;
};

export const getCustomThemeColours = (theme: CustomTheme) => {
  return {...themes[theme.base], ...theme.data} as Theme;
};
