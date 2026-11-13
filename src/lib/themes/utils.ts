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
  const customThemes = storage.getString('customThemes') ?? '{}';
  const parsedThemesObject = JSON.parse(customThemes) as CustomThemeCollection;
  return parsedThemesObject;
};

export const setCustomThemeCollection = (id: string, data: CustomTheme) => {
  const customThemes = getCustomThemeCollection();
  customThemes[id] = data;
  storage.set('customThemes', JSON.stringify(customThemes));
  return;
};

export const getCustomThemeColours = (theme: CustomTheme) => {
  return {...themes[theme.base], ...theme.data} as Theme;
};

export const getUnistylesThemes = () => {
  let returnedThemes = {...themes};
  try {
    const themeCollection = getCustomThemeCollection();

    const entries = Object.entries(themeCollection);

    if (entries.length) {
      for (const [key, theme] of entries) {
        const finalThemeColours = getCustomThemeColours(theme);
        returnedThemes[`custom-${key}`] = finalThemeColours;
      }
    }
  } catch {
    returnedThemes = themes;
  }
  return returnedThemes;
};
