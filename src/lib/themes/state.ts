import {createContext} from 'react';
import {Theme, themes} from './data';

/**
 * @deprecated Use Unistyles instead
 */
export const ThemeContext = createContext<{
  currentTheme: Theme;
  setCurrentTheme: Function;
}>({currentTheme: themes.Dark, setCurrentTheme: () => {}});
